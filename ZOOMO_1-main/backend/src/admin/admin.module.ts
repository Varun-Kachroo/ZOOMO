import { Module } from "@nestjs/common";
import { AdminAuthModule } from "./admin-auth/admin-auth.module";
import { AdminOrdersModule } from "./admin-orders/admin-orders.module";
import { AdminDriversModule } from "./admin-drivers/admin-drivers.module";
import { AdminJwtStrategy } from "./strategies/admin-jwt.strategy/admin-jwt.strategy";

@Module({
  imports: [
    AdminAuthModule,
    AdminOrdersModule,
    AdminDriversModule,
  ],
  providers: [AdminJwtStrategy],
})
export class AdminModule {}
