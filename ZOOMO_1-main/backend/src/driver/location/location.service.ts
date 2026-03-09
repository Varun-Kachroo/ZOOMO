import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class DriverLocationService {
  constructor(private prisma: PrismaService) {}

  async updateLocation(
    userId: string,
    lat: number,
    lng: number
  ) {
    return this.prisma.driver.update({
      where: { userId },
      data: {
        currentLat: lat,
        currentLng: lng,
        updatedAt: new Date(),
      },
    });
  }
}
