import { Body, Controller, Post } from '@nestjs/common';
import { MerchantAuthService } from './merchant-auth.service';

@Controller('merchant/auth')
export class MerchantAuthController {
  constructor(private readonly authService: MerchantAuthService) {}

  @Post('signup')
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
