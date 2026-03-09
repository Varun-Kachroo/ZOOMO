import { Module } from "@nestjs/common";
import { PrismaModule } from "../common/prisma.module";
import { DriverAuthModule } from "./auth/auth.module";
import { DriverMeController } from "./me.controller";
import { DriverMeService } from "./me.service";
import { DriverOrdersController } from "./orders.controller";
import { DriverOrdersService } from "./orders.service";
import { AvailabilityModule } from './availability/availability.module';
import { LocationModule } from './location/location.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, DriverAuthModule, AvailabilityModule, LocationModule, DashboardModule],
  controllers: [
    DriverMeController,
    DriverOrdersController,
  ],
  providers: [
    DriverMeService,
    DriverOrdersService,
  ],
})
export class DriverModule {}
