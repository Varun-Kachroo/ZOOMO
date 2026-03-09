import { Controller, Post, Body } from "@nestjs/common";
import { DriverAuthService } from "./driver-auth.service";

@Controller("driver/auth")
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  /**
   * Driver Login
   * Only users with role = DRIVER are allowed
   * No signup from driver app
   */
  @Post("login")
  async login(
    @Body() body: { email: string; password: string }
  ) {
    return this.driverAuthService.login(
      body.email,
      body.password
    );
  }
}
