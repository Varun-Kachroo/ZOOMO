import { Body, Controller, Get, Patch, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/me
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Req() req) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new UnauthorizedException("User not found");
    return user; // return FULL user
  }

  // ✅ NEW — PATCH /users/me — lets a customer update their own name/phone
  @UseGuards(JwtAuthGuard)
  @Patch("me")
  async updateMe(@Req() req, @Body() body: any) {
    const { name, phone } = body;
    return this.usersService.update(req.user.id, { name, phone });
  }
}
