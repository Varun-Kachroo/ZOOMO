import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class DriverDashboardService {
  constructor(private prisma: PrismaService) {}

  private async getDriverId(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) {
      throw new ForbiddenException("Driver profile not found");
    }

    return driver.id;
  }

  async getTodayStats(userId: string) {
    const driverId = await this.getDriverId(userId);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await this.prisma.order.findMany({
      where: {
        driverId,
        status: OrderStatus.DELIVERED,
        actualDeliveryTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        total: true,
        actualDeliveryTime: true,
      },
    });

    const totalEarnings = orders.reduce(
      (sum, o) => sum + o.total,
      0
    );

    return {
      totalOrders: orders.length,
      totalEarnings,
      lastDeliveryAt:
        orders.length > 0
          ? orders[orders.length - 1].actualDeliveryTime
          : null,
    };
  }
}
