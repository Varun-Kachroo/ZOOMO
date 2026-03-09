import {
  Controller,
  Patch,
  Post,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DriverAvailabilityService } from "./driver-availability.service";
import { JwtAuthGuard } from "../../../auth/jwt-auth.guard";
import { RolesGuard } from "../../../auth/roles.guard";
import { Roles } from "../../../auth/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("driver")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
export class DriverAvailabilityController {
  constructor(
    private readonly availabilityService: DriverAvailabilityService
  ) {}

  @Patch("availability")
  setAvailability(
    @Req() req,
    @Body("isAvailable") isAvailable: boolean
  ) {
    return this.availabilityService.setAvailability(
      req.user.id,
      isAvailable
    );
  }

  @Post("heartbeat")
  heartbeat(@Req() req) {
    return this.availabilityService.heartbeat(req.user.id);
  }

  @Post("me")
  getMe(@Req() req) {
    return this.availabilityService.getMe(req.user.id);
  }
}
