import { Module } from '@nestjs/common';
import { DriverLocationService } from './location.service';
import { DriverLocationController } from './location.controller';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DriverLocationService],
  controllers: [DriverLocationController]
})
export class LocationModule {}
