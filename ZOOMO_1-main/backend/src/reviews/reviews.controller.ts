import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('restaurants/:id/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // Public — anyone can read reviews
  @Get()
  getReviews(@Param('id') restaurantId: string) {
    return this.reviewsService.findForRestaurant(restaurantId);
  }

  // Requires login — only signed-in customers can write a review
  @Post()
  @UseGuards(JwtAuthGuard)
  createReview(
    @Param('id') restaurantId: string,
    @Req() req,
    @Body() body: any,
  ) {
    return this.reviewsService.create(req.user.id, restaurantId, body);
  }
}
