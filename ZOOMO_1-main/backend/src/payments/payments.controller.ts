import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("payments")
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post("intent")
  createIntent(@Body() body) {
    const { orderId, provider } = body;
    return this.paymentsService.createPaymentIntent(orderId, provider);
  }
}
