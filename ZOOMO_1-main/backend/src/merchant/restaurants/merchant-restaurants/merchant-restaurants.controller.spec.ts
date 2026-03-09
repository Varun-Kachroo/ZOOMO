import { Test, TestingModule } from '@nestjs/testing';
import { MerchantRestaurantsController } from './merchant-restaurants.controller';

describe('MerchantRestaurantsController', () => {
  let controller: MerchantRestaurantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantRestaurantsController],
    }).compile();

    controller = module.get<MerchantRestaurantsController>(MerchantRestaurantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
