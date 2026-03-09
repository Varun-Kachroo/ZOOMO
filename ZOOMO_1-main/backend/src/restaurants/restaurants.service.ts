import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  // List all restaurants
  findAll() {
    return this.prisma.restaurant.findMany({
      include: {
        reviews: true,
        dishes: true,
      },
    });
  }

  // Find one restaurant
  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        dishes: true,
        reviews: true,
      },
    });

    if (!restaurant) throw new NotFoundException("Restaurant not found");

    return restaurant;
  }


}
