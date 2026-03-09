import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  // FETCH DISHES FOR A RESTAURANT
  findByRestaurant(restaurantId: string) {
    return this.prisma.dish.findMany({
      where: { restaurantId },
    });
  }

  // FETCH A SINGLE DISH
  async findOne(id: string) {
    const dish = await this.prisma.dish.findUnique({ where: { id } });
    if (!dish) throw new NotFoundException("Dish not found");
    return dish;
  }

  // CREATE DISH
  create(data: any, restaurantId: string) {
    return this.prisma.dish.create({
      data: {
        ...data,
        price: Number(data.price),
        restaurantId,
      },
    });
  }

  // UPDATE DISH
  update(id: string, data: any) {
    return this.prisma.dish.update({
      where: { id },
      data,
    });
  }

  // DELETE DISH
  delete(id: string) {
    return this.prisma.dish.delete({ where: { id } });
  }
}
