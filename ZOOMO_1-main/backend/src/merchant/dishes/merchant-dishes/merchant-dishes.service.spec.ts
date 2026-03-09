import { Test, TestingModule } from '@nestjs/testing';
import { MerchantDishesService } from './merchant-dishes.service';

describe('MerchantDishesService', () => {
  let service: MerchantDishesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantDishesService],
    }).compile();

    service = module.get<MerchantDishesService>(MerchantDishesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
