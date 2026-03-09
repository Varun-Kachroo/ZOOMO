import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 1. User exists
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // 2. Password check
    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // 3. ROLE CHECK (CRITICAL)
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Access denied");
    }

    // 4. JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
