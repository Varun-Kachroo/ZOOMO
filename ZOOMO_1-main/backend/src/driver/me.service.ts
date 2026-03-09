import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class DriverMeService {
  constructor(private readonly prisma: PrismaService) {}

  async updateAvailability(driverId: string, isAvailable: boolean) {
    return this.prisma.driver.update({
      where: { id: driverId },
      data: { isAvailable },
      select: {
        id: true,
        isAvailable: true,
      },
    });
  }

  async getDriverProfile(userId: string) {
    return this.prisma.driver.findUnique({
      where: { userId },
      select: {
        id: true,
        isAvailable: true,
        currentLat: true,
        currentLng: true,
      },
    });
  }
}
