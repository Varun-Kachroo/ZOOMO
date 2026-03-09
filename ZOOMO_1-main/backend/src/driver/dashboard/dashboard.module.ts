import { Module } from '@nestjs/common';
import { DriverDashboardService } from './dashboard.service';
import { DriverDashboardController } from './dashboard.controller';

@Module({
  providers: [DriverDashboardService],
  controllers: [DriverDashboardController]
})
export class DashboardModule {}
