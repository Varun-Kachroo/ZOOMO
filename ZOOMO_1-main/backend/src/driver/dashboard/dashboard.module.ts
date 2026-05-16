import { Module } from '@nestjs/common';
import { DriverDashboardService } from './dashboard.service';
import { DriverDashboardController } from './dashboard.controller';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DriverDashboardService],
  controllers: [DriverDashboardController]
})
export class DashboardModule {}
