import { Injectable, ForbiddenException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRole } from "@prisma/client";

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(
  Strategy,
  "admin-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ADMIN_JWT_SECRET || "admin_secret",
    });
  }

  async validate(payload: any) {
    if (payload.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Admin access only");
    }

    return payload;
  }
}
