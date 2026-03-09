import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MerchantRestaurantsService } from './merchant-restaurants.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Roles } from '../../../auth/roles.decorator';

@Controller('merchant/restaurants')
@UseGuards(JwtAuthGuard)
@Roles('MERCHANT')
export class MerchantRestaurantsController {
  constructor(
    private readonly service: MerchantRestaurantsService,
  ) {}

  // ✅ CREATE RESTAURANT (merchant only)
  @Post()
  createRestaurant(@Req() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  // ✅ GET OWN RESTAURANT
  @Get('me')
  getMyRestaurant(@Req() req) {
    return this.service.getMyRestaurant(req.user.id);
  }

  // ✅ UPDATE OWN RESTAURANT
  @Patch(':id')
  updateRestaurant(
    @Req() req,
    @Param('id') restaurantId: string,
    @Body() body: any,
  ) {
    return this.service.update(
      req.user.id,
      restaurantId,
      body,
    );
  }
}
