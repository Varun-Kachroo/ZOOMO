import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { OrderStatus } from "@prisma/client";
import { RealtimeGateway } from "../realtime/realtime.gateway";

@Injectable()
export class DriverOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    // ✅ NEW — pushes a live update to the customer the instant a
    // driver marks an order picked up or delivered.
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  /* ===========================
     RESOLVE DRIVER
  ============================ */
  private async getDriverId(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) {
      throw new ForbiddenException("Driver profile not found");
    }

    return driver.id;
  }

  /* ===========================
     GET ASSIGNED ORDERS (LIST)
  ============================ */
  async getAssignedOrders(userId: string) {
    const driverId = await this.getDriverId(userId);

    return this.prisma.order.findMany({
      where: {
        driverId,
        status: {
          in: [
            OrderStatus.READY_FOR_PICKUP,
            OrderStatus.OUT_FOR_DELIVERY,
          ],
        },
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        status: true,
        total: true,
        restaurant: {
          select: {
            name: true,
            address: true,
            lat: true,
            lng: true,
          },
        },
        address: {
          select: {
            street: true,
            city: true,
            lat: true,
            lng: true,
          },
        },
      },
    });
  }

  /* ===========================
     MARK PICKED UP
  ============================ */
  async markPickedUp(orderId: string, userId: string) {
    const driverId = await this.getDriverId(userId);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.driverId !== driverId)
      throw new ForbiddenException("Not your order");
    if (order.status !== OrderStatus.READY_FOR_PICKUP)
      throw new ForbiddenException("Order not ready for pickup");

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.OUT_FOR_DELIVERY },
      select: { id: true, status: true },
    });

    // ✅ NEW
    this.realtimeGateway.broadcastOrderStatus(orderId, OrderStatus.OUT_FOR_DELIVERY);

    return updated;
  }

  /* ===========================
     MARK DELIVERED (COD SAFE)
  ============================ */
  async markDelivered(orderId: string, userId: string) {
    const driverId = await this.getDriverId(userId);

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        driverId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found or not assigned to you");
    }

    if (order.status !== OrderStatus.OUT_FOR_DELIVERY) {
      throw new ForbiddenException("Order not out for delivery");
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          actualDeliveryTime: new Date(),
        },
      });

      if (
        order.payment &&
        order.payment.method === "COD" &&
        order.payment.status === "PENDING"
      ) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: { status: "COMPLETED" },
        });
      }

      return updatedOrder;
    });

    // ✅ NEW
    this.realtimeGateway.broadcastOrderStatus(orderId, OrderStatus.DELIVERED);

    return result;
  }

  /* ===========================
     GET ORDER DETAILS (DRIVER)
  ============================ */
  async getOrderDetails(orderId: string, userId: string) {
    const driverId = await this.getDriverId(userId);

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        driverId,
      },
      include: {
        user: true,
        restaurant: true,
        address: true,
        items: {
          include: {
            dish: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException(
        "Order not found or not assigned to you"
      );
    }

    return {
      id: order.id,
      status: order.status,
      total: order.total,

      restaurant: {
        name: order.restaurant.name,
        address: order.restaurant.address,
        imageUrl: order.restaurant.imageUrl,
        lat: order.restaurant.lat,
        lng: order.restaurant.lng,
      },

      customer: {
        name: order.user.name,
        phone: order.user.phone,
      },

      address: order.address && {
        street: order.address.street,
        city: order.address.city,
        lat: order.address.lat,
        lng: order.address.lng,
      },

      payment: {
        method: order.payment?.method ?? "ONLINE",
      },

      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        dish: {
          id: item.dish.id,
          name: item.dish.name,
        },
      })),
    };
  }
}
