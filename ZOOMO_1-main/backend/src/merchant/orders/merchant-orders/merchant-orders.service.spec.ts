import { Test, TestingModule } from '@nestjs/testing';
import { MerchantOrdersService } from './merchant-orders.service';

describe('MerchantOrdersService', () => {
  let service: MerchantOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantOrdersService],
    }).compile();

    service = module.get<MerchantOrdersService>(MerchantOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
