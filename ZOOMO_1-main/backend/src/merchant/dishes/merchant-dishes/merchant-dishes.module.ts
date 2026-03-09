import { Module } from '@nestjs/common';
import { MerchantDishesController } from './merchant-dishes.controller';
import { MerchantDishesService } from './merchant-dishes.service';
import { PrismaModule } from '../../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MerchantDishesController],
  providers: [MerchantDishesService],
})
export class MerchantDishesModule {}
