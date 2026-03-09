import { Module } from '@nestjs/common';
import { MerchantOrdersController } from './merchant-orders.controller';
import { MerchantOrdersService } from './merchant-orders.service';
import { PrismaModule } from '../../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MerchantOrdersController],
  providers: [MerchantOrdersService],
})
export class MerchantOrdersModule {}
