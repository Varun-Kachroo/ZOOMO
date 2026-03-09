import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  /* ================================
     CUSTOMER SIGNUP (USER ROLE ONLY)
  ================================== */
  async signup(dto: any) {
    if (!dto.email || !dto.password || !dto.name) {
      throw new BadRequestException("Missing required fields");
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new UnauthorizedException("Email already in use");

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
      phone: dto.phone || "",
      role: "USER", // 🔐 Enforced
    });

    return this.makeTokenResponse(user);
  }

  /* ================================
          CUSTOMER LOGIN
  ================================== */
  async login(dto: any) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException("Invalid email or password");

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid email or password");

    // 🚫 Prevent merchant/admin access
    if (user.role !== "USER") {
      throw new UnauthorizedException("Access denied for this role");
    }

    return this.makeTokenResponse(user);
  }

  /* ================================
           TOKEN RESPONSE
  ================================== */
  private makeTokenResponse(user) {
    // 👇 must match jwt.strategy validate()
    const payload = { id: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token, // 👈 ALWAYS use this key
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
