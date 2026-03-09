import { Controller, Get } from '@nestjs/common';

@Controller('merchant')
export class MerchantController {
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'merchant-api',
      timestamp: new Date(),
    };
  }
}
