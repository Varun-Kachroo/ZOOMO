import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DriverLocationService } from "./location.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../auth/roles.guard";
import { Roles } from "../../auth/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("driver/location")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
export class DriverLocationController {
  constructor(
    private readonly locationService: DriverLocationService
  ) {}

  @Post()
  update(
    @Req() req,
    @Body("lat") lat: number,
    @Body("lng") lng: number
  ) {
    return this.locationService.updateLocation(
      req.user.id,
      lat,
      lng
    );
  }
}
