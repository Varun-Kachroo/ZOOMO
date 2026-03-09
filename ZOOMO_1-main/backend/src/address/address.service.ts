import {
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { geocodeAddress } from "../common/geocode.util";

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  /* ===========================
     GET USER ADDRESSES
  =========================== */
  getUserAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /* ===========================
     CREATE ADDRESS (WITH GEO)
  =========================== */
  async createAddress(userId: string, data: any) {
    const {
      street,
      city,
      state,
      zipCode,
      country = "India",
      isDefault,
    } = data;

    if (!street || !city || !state || !zipCode) {
      throw new BadRequestException(
        "Incomplete address details"
      );
    }

    // 🔥 BUILD FULL ADDRESS STRING
    const fullAddress = `${street}, ${city}, ${state}, ${zipCode}, ${country}`;

    // 🌍 GEOCODE
    const location = await geocodeAddress(fullAddress);

    return this.prisma.address.create({
      data: {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault ?? false,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
        userId,
      },
    });
  }

  /* ===========================
     UPDATE ADDRESS (RE-GEO)
  =========================== */
  async updateAddress(
    id: string,
    userId: string,
    data: any
  ) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new BadRequestException(
        "Address not found"
      );
    }

    const street = data.street ?? address.street;
    const city = data.city ?? address.city;
    const state = data.state ?? address.state;
    const zipCode = data.zipCode ?? address.zipCode;
    const country =
      data.country ?? address.country ?? "India";

    const fullAddress = `${street}, ${city}, ${state}, ${zipCode}, ${country}`;

    // 🌍 RE-GEOCODE ON UPDATE
    const location = await geocodeAddress(fullAddress);

    return this.prisma.address.update({
      where: { id },
      data: {
        ...data,
        lat: location?.lat ?? address.lat,
        lng: location?.lng ?? address.lng,
      },
    });
  }

  /* ===========================
     DELETE ADDRESS
  =========================== */
  async deleteAddress(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new BadRequestException(
        "Address not found"
      );
    }

    return this.prisma.address.delete({
      where: { id },
    });
  }
}
