import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { geocodeAddress } from "../../../common/geocode.util";

@Injectable()
export class MerchantRestaurantsService {
  constructor(private prisma: PrismaService) {}

  // CREATE (Onboarding)
  async create(ownerId: string, body: any) {
  const existing = await this.prisma.restaurant.findFirst({
    where: { ownerId },
  });

  if (existing) {
    throw new BadRequestException(
      "Merchant already has a restaurant",
    );
  }

  if (!body.name || !body.address) {
    throw new BadRequestException(
      "Restaurant name and address are required",
    );
  }

  // 🌍 GEOCODE ONCE
  const geo = await geocodeAddress(body.address);

  return this.prisma.restaurant.create({
    data: {
      name: body.name,
      description: body.description,
      address: body.address,
      phone: body.phone,
      email: body.email,
      openingHours: body.openingHours,
      cuisineType: body.cuisineType,
      priceRange: body.priceRange,
      isActive:
        body.isActive !== undefined ? body.isActive : true,
      ownerId,

      
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
    },
  });
}
  // GET MY RESTAURANT
  async getMyRestaurant(ownerId: string) {
    const restaurant =
      await this.prisma.restaurant.findFirst({
        where: { ownerId },
      });

    if (!restaurant) {
      throw new NotFoundException(
        'Restaurant not found for this merchant',
      );
    }

    return restaurant;
  }

  // UPDATE PROFILE
  async update(
  ownerId: string,
  restaurantId: string,
  body: any,
) {
  const restaurant =
    await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

  if (!restaurant) {
    throw new NotFoundException("Restaurant not found");
  }

  if (restaurant.ownerId !== ownerId) {
    throw new ForbiddenException(
      "You do not own this restaurant",
    );
  }

  let lat = restaurant.lat;
  let lng = restaurant.lng;

  // 🌍 RE-GEOCODE ONLY IF ADDRESS CHANGED
  if (body.address && body.address !== restaurant.address) {
    const geo = await geocodeAddress(body.address);
    lat = geo?.lat ?? null;
    lng = geo?.lng ?? null;
  }

  return this.prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      name: body.name,
      description: body.description,
      address: body.address,
      phone: body.phone,
      email: body.email,
      openingHours: body.openingHours,
      cuisineType: body.cuisineType,
      priceRange: body.priceRange,
      isActive: body.isActive,

      // ✅ UPDATED IF NEEDED
      lat,
      lng,
    },
  });
}
}