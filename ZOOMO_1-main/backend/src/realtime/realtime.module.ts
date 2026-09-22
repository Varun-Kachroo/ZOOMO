import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RealtimeGateway } from './realtime.gateway';
import { PrismaModule } from '../common/prisma.module';

@Module({
  imports: [
    PrismaModule,
    // Same secret as every other JwtModule.register() call in this app —
    // lets the gateway verify both customer and driver tokens.
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway], // so MerchantOrdersModule / DriverModule can inject it
})
export class RealtimeModule {}
