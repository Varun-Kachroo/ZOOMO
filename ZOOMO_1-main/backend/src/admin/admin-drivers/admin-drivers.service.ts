import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class AdminDriversService {
  constructor(private prisma: PrismaService) {}

  async getAllDrivers() {
    const drivers = await this.prisma.driver.findMany({
      select: {
        id: true,
        isAvailable: true,
        vehicleType: true,
        user: {
          select: {
            name: true,
          },
        },
        orders: {
          where: {
            status: {
              in: [
                OrderStatus.OUT_FOR_DELIVERY,
                OrderStatus.READY_FOR_PICKUP,
              ],
            },
          },
          select: { id: true },
        },
      },
    });

    // map to add activeOrderCount
    return drivers.map((driver) => ({
      id: driver.id,
      isAvailable: driver.isAvailable,
      vehicleType: driver.vehicleType,
      user: driver.user,
      activeOrderCount: driver.orders.length,
    }));
  }
}
