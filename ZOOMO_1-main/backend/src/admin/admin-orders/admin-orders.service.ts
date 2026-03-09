import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class AdminOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /* ===========================
     GET ALL ORDERS (ADMIN)
  ============================ */
  async getAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: true,
        driver: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  /* ===========================
     ASSIGN DRIVER (ADMIN)
  ============================ */
  async assignDriver(orderId: string, driverId: string) {
    /* -------- ORDER VALIDATION -------- */
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.driverId) {
      throw new BadRequestException(
        "Order already assigned to a driver"
      );
    }

    if (order.status !== OrderStatus.READY_FOR_PICKUP) {
      throw new BadRequestException(
        "Only READY_FOR_PICKUP orders can be assigned"
      );
    }

    /* -------- DRIVER VALIDATION -------- */
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new BadRequestException("Driver not found");
    }

    /* 🚨 CRITICAL: CHECK ACTIVE ORDERS */
    const activeOrdersCount =
      await this.prisma.order.count({
        where: {
          driverId,
          status: {
            in: [
              OrderStatus.READY_FOR_PICKUP,
              OrderStatus.OUT_FOR_DELIVERY,
            ],
          },
        },
      });

    if (activeOrdersCount > 0) {
      throw new BadRequestException(
        "Driver already has an active order"
      );
    }

    /* -------- ASSIGN & LOCK DRIVER -------- */
    return this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: {
          driverId,
        },
      }),

      this.prisma.driver.update({
        where: { id: driverId },
        data: {
          isAvailable: false,
        },
      }),
    ]);
  }
}
