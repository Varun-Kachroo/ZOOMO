import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { OrderStatus } from '@prisma/client';
import { RealtimeGateway } from '../../../realtime/realtime.gateway';

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  SCHEDULED: OrderStatus.PENDING,
  PENDING: OrderStatus.PREPARING,
  PREPARING: OrderStatus.READY_FOR_PICKUP,
  READY_FOR_PICKUP: OrderStatus.OUT_FOR_DELIVERY,
  OUT_FOR_DELIVERY: OrderStatus.DELIVERED,
  DELIVERED: null,
  CANCELLED: null,
};

@Injectable()
export class MerchantOrdersService {
  constructor(
    private prisma: PrismaService,
    // ✅ NEW — lets this service push a live update the moment a
    // merchant changes an order's status, instead of the customer
    // only finding out on their next manual refresh.
    private realtimeGateway: RealtimeGateway,
  ) { }

  private async assertRestaurantOwnership(
    merchantId: string,
    restaurantId: string,
  ) {
    const restaurant =
      await this.prisma.restaurant.findFirst({
        where: {
          id: restaurantId,
          ownerId: merchantId,
        },
      });

    if (!restaurant) {
      throw new ForbiddenException(
        'Not your restaurant',
      );
    }

    return restaurant;
  }

  // ✅ GET ALL ORDERS
  async getOrders(
    merchantId: string,
    restaurantId: string,
  ) {
    await this.assertRestaurantOwnership(
      merchantId,
      restaurantId,
    );

    return this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        items: { include: { dish: true } },
        user: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ GET SINGLE ORDER
  async getOrderById(
    merchantId: string,
    restaurantId: string,
    orderId: string,
  ) {
    await this.assertRestaurantOwnership(
      merchantId,
      restaurantId,
    );

    const order =
      await this.prisma.order.findFirst({
        where: {
          id: orderId,
          restaurantId,
        },
        include: {
          items: { include: { dish: true } },
          user: true,
          address: true,
        },
      });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // ✅ UPDATE STATUS
  async updateStatus(
    merchantId: string,
    restaurantId: string,
    orderId: string,
    nextStatus: OrderStatus,
  ) {
    await this.assertRestaurantOwnership(
      merchantId,
      restaurantId,
    );

    const order =
      await this.prisma.order.findFirst({
        where: {
          id: orderId,
          restaurantId,
        },
      });

    if (!order)
      throw new NotFoundException('Order not found');

    const allowedNext =
      STATUS_FLOW[order.status];

    if (allowedNext !== nextStatus) {
      throw new BadRequestException(
        `Invalid status transition from ${order.status} to ${nextStatus}`,
      );
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
    });

    // ✅ NEW — push the change live to anyone tracking this order
    this.realtimeGateway.broadcastOrderStatus(orderId, nextStatus);

    return updated;
  }

  // ✅ CANCEL ORDER
  async cancelOrder(
    merchantId: string,
    restaurantId: string,
    orderId: string,
  ) {
    await this.assertRestaurantOwnership(
      merchantId,
      restaurantId,
    );

    const order =
      await this.prisma.order.findFirst({
        where: {
          id: orderId,
          restaurantId,
        },
      });

    if (!order)
      throw new NotFoundException('Order not found');

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.SCHEDULED
    ) {
      throw new BadRequestException(
        'Only pending or scheduled orders can be cancelled',
      );
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    // ✅ NEW
    this.realtimeGateway.broadcastOrderStatus(orderId, 'CANCELLED');

    return updated;
  }
}
