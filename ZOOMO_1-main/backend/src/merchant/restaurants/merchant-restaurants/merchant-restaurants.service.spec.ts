import { Test, TestingModule } from '@nestjs/testing';
import { MerchantRestaurantsService } from './merchant-restaurants.service';

describe('MerchantRestaurantsService', () => {
  let service: MerchantRestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantRestaurantsService],
    }).compile();

    service = module.get<MerchantRestaurantsService>(MerchantRestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
