import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { DriverAuthController } from "./driver-auth.controller";
import { DriverAuthService } from "./driver-auth.service";
import { DriverJwtStrategy } from "./driver-jwt.stratergy";
import { PrismaModule } from "../../common/prisma.module";

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "7d",
      },
    }),
  ],
  controllers: [DriverAuthController],
  providers: [DriverAuthService, DriverJwtStrategy],
})
export class DriverAuthModule {}
