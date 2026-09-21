import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /* ================================
     CUSTOMER SIGNUP (USER ROLE ONLY)
  ================================== */
  async signup(dto: any) {
    if (!dto.email || !dto.password || !dto.name) {
      throw new BadRequestException('Missing required fields');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new UnauthorizedException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
      phone: dto.phone || '',
      role: 'USER', // 🔐 Enforced
    });

    return this.makeTokenResponse(user);
  }

  /* ================================
          CUSTOMER LOGIN
  ================================== */
  async login(dto: any) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    // ✅ Google-only accounts have no password — send them to Google login instead
    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please continue with Google.',
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    // 🚫 Prevent merchant/admin access
    if (user.role !== 'USER') {
      throw new UnauthorizedException('Access denied for this role');
    }

    return this.makeTokenResponse(user);
  }

  /* ================================
     GOOGLE SIGN-IN (LOGIN OR SIGNUP)
     Used identically for both the Login and Signup pages — whichever
     one the person clicks, the result is the same: find their account
     by googleId, else by email (linking an existing password account
     to Google), else create a brand-new USER account.
  ================================== */
  async googleAuth(idToken: string) {
    if (!idToken) throw new BadRequestException('Missing Google credential');

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Invalid Google credential');
    }

    if (!payload?.email) {
      throw new UnauthorizedException('Google account has no email');
    }

    // 1. Already signed up with Google before → log them straight in
    let user = await this.usersService.findByGoogleId(payload.sub);

    // 2. No Google-linked account yet, but an account with this email
    //    already exists (they signed up with a password originally) →
    //    link Google to that same account rather than creating a duplicate.
    if (!user) {
      const existing = await this.usersService.findByEmail(payload.email);
      if (existing) {
        if (existing.role !== 'USER') {
          throw new UnauthorizedException(
            'This email is registered as a merchant/staff account. Please use the correct app.',
          );
        }
        user = await this.usersService.linkGoogleId(existing.id, payload.sub);
      }
    }

    // 3. Brand-new person → create a fresh USER account, no password needed
    if (!user) {
      user = await this.usersService.create({
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        googleId: payload.sub,
        password: null,
        role: 'USER',
      });
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
