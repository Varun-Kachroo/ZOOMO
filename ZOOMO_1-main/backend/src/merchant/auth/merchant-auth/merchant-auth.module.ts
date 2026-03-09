import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MerchantAuthController } from './merchant-auth.controller';
import { MerchantAuthService } from './merchant-auth.service';
import { PrismaModule } from '../../../common/prisma.module'; 

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [MerchantAuthController],
  providers: [MerchantAuthService],
})
export class MerchantAuthModule {}
