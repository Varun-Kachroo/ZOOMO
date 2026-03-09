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
import { MerchantDishesService } from './merchant-dishes.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Roles } from '../../../auth/roles.decorator';

@Controller('merchant/dishes')
@UseGuards(JwtAuthGuard)
@Roles('MERCHANT')
export class MerchantDishesController {
  constructor(private readonly service: MerchantDishesService) {}

  // ✅ CREATE DISH
  @Post()
  createDish(@Req() req, @Body() body: any) {
    return this.service.createForMerchant(
      req.user.id,
      body,
    );
  }

  // ✅ GET MENU
  @Get()
  getMenu(@Req() req) {
    return this.service.getMenuForMerchant(
      req.user.id,
    );
  }

  // ✅ GET SINGLE DISH (🔥 REQUIRED FOR EDIT 🔥)
  @Get(':id')
  getDishById(
    @Req() req,
    @Param('id') dishId: string,
  ) {
    return this.service.getDishById(
      req.user.id,
      dishId,
    );
  }

  // ✅ UPDATE DISH
  @Patch(':id')
  updateDish(
    @Req() req,
    @Param('id') dishId: string,
    @Body() body: any,
  ) {
    return this.service.update(
      req.user.id,
      dishId,
      body,
    );
  }

  // ✅ TOGGLE AVAILABILITY
  @Patch(':id/toggle')
  toggleAvailability(
    @Req() req,
    @Param('id') dishId: string,
  ) {
    return this.service.toggleAvailability(
      req.user.id,
      dishId,
    );
  }
}
