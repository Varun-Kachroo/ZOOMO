import { Controller, Get, Patch, Param, Body } from "@nestjs/common";
import { AdminOrdersService } from "./admin-orders.service";
import { AdminJwtGuard } from "../guards/admin-jwt/admin-jwt.guard";
import { UseGuards } from "@nestjs/common/decorators";

@Controller("admin/orders")
@UseGuards(AdminJwtGuard)
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  getAllOrders() {
    return this.adminOrdersService.getAllOrders();
  }

  @Patch(":orderId/assign-driver")
  assignDriver(
    @Param("orderId") orderId: string,
    @Body("driverId") driverId: string
  ) {
    return this.adminOrdersService.assignDriver(orderId, driverId);
  }
}
