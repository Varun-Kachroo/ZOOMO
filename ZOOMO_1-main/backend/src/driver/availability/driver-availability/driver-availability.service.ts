import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma.service";

@Injectable()
export class DriverAvailabilityService {
  private readonly OFFLINE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

  constructor(private prisma: PrismaService) {}

  async setAvailability(userId: string, isAvailable: boolean) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) {
      throw new ForbiddenException("Driver profile not found");
    }

    return this.prisma.driver.update({
      where: { id: driver.id },
      data: {
        isAvailable,
        updatedAt: new Date(),
      },
    });
  }

  async heartbeat(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) return;

    return this.prisma.driver.update({
      where: { id: driver.id },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  async getMe(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) {
      throw new ForbiddenException("Driver profile not found");
    }

    const now = Date.now();
    const lastSeen = driver.updatedAt.getTime();

    const effectiveIsAvailable =
      driver.isAvailable &&
      now - lastSeen < this.OFFLINE_TIMEOUT_MS;

    return {
      ...driver,
      isAvailable: effectiveIsAvailable,
    };
  }
}
