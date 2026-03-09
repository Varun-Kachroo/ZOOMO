import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRole } from "@prisma/client";

@Injectable()
export class DriverJwtStrategy extends PassportStrategy(
  Strategy,
  "driver-jwt" 
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
  
    if (payload.role !== UserRole.DRIVER) {
      throw new UnauthorizedException("Invalid driver token");
    }

    return {
      userId: payload.id ?? payload.sub,
      driverId: payload.driverId,
      role: payload.role,
    };
  }
}
