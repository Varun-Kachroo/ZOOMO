import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // Support both {sub: "..."} and {id: "..."}
    const userId = payload.sub ?? payload.id;

    return {
      id: userId,
      email: payload.email,
      role: payload.role, // MERCHANT or USER
    };
  }
}
