import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // GET /restaurants/:id/reviews
  async findForRestaurant(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return this.prisma.review.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  // POST /restaurants/:id/reviews
  async create(userId: string, restaurantId: string, body: any) {
    const rating = Number(body.rating);

    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // One review per user per restaurant — if they already reviewed it,
    // update their existing review instead of creating a duplicate.
    const existing = await this.prisma.review.findFirst({
      where: { userId, restaurantId },
    });

    // Only customers who actually ordered from this restaurant can review it.
    // (Skip this check if you'd rather allow anyone to review — but this
    // matches how most real food-delivery apps gate reviews.)
    const hasOrdered = await this.prisma.order.findFirst({
      where: { userId, restaurantId, status: { in: ['DELIVERED'] } },
    });
    if (!hasOrdered && !existing) {
      throw new ForbiddenException(
        'You can only review restaurants you have ordered from',
      );
    }

    let review;
    if (existing) {
      review = await this.prisma.review.update({
        where: { id: existing.id },
        data: { rating, comment: body.comment || null },
        include: { user: { select: { id: true, name: true } } },
      });
    } else {
      review = await this.prisma.review.create({
        data: {
          rating,
          comment: body.comment || null,
          userId,
          restaurantId,
        },
        include: { user: { select: { id: true, name: true } } },
      });
    }

    await this.recomputeAverageRating(restaurantId);

    return review;
  }

  // Keeps Restaurant.rating (used everywhere for the star badge on cards)
  // in sync with the actual average of all reviews for that restaurant.
  private async recomputeAverageRating(restaurantId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { restaurantId },
      _avg: { rating: true },
    });

    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: { rating: agg._avg.rating ?? 0 },
    });
  }
}
