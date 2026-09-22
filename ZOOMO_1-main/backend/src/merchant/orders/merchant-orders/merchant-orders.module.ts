import { Module } from '@nestjs/common';
import { MerchantOrdersController } from './merchant-orders.controller';
import { MerchantOrdersService } from './merchant-orders.service';
import { PrismaModule } from '../../../common/prisma.module';
import { RealtimeModule } from '../../../realtime/realtime.module';

@Module({
  imports: [PrismaModule, RealtimeModule],
  controllers: [MerchantOrdersController],
  providers: [MerchantOrdersService],
})
export class MerchantOrdersModule {}
