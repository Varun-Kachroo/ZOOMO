import { Controller, Get } from "@nestjs/common";
import { AdminDriversService } from "./admin-drivers.service";
import { UseGuards } from "@nestjs/common";
import { AdminJwtGuard } from "../guards/admin-jwt/admin-jwt.guard";

@Controller("admin/drivers")
@UseGuards(AdminJwtGuard)

export class AdminDriversController {
  constructor(private readonly adminDriversService: AdminDriversService) {}

  @Get()
  getAllDrivers() {
    return this.adminDriversService.getAllDrivers();
  }
}
