import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DriverDashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../auth/roles.guard";
import { Roles } from "../../auth/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("driver/dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
export class DriverDashboardController {
  constructor(
    private readonly dashboardService: DriverDashboardService
  ) {}

  @Get()
  getTodayStats(@Req() req) {
    return this.dashboardService.getTodayStats(
      req.user.id
    );
  }
}
