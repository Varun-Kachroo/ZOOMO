import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(data) {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // ✅ NEW — for Google Sign-In
  findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  // ✅ NEW — links a Google account to an existing password-based account
  // (same email signed up normally before, now clicking "Continue with Google")
  linkGoogleId(userId: string, googleId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });
  }

  // ✅ NEW — for the Account Settings page (edit name/phone)
  update(id: string, data: { name?: string; phone?: string }) {
    // Only include fields that were actually provided, so a blank/undefined
    // field doesn't accidentally wipe out the existing value.
    const cleanData: any = {};
    if (data.name !== undefined && data.name !== "") cleanData.name = data.name;
    if (data.phone !== undefined) cleanData.phone = data.phone;

    return this.prisma.user.update({
      where: { id },
      data: cleanData,
    });
  }
}
