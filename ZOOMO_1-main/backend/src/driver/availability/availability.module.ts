import { Module } from '@nestjs/common';
import { DriverAvailabilityService } from './driver-availability/driver-availability.service';
import { DriverAvailabilityController } from './driver-availability/driver-availability.controller';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DriverAvailabilityService],
  controllers: [DriverAvailabilityController]
})
export class AvailabilityModule {}
