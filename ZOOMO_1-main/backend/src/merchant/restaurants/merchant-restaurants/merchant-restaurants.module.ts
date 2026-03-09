import { Module } from '@nestjs/common';
import { MerchantRestaurantsController } from './merchant-restaurants.controller';
import { MerchantRestaurantsService } from './merchant-restaurants.service';
import { PrismaModule } from '../../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MerchantRestaurantsController],
  providers: [MerchantRestaurantsService],
})
export class MerchantRestaurantsModule {}
