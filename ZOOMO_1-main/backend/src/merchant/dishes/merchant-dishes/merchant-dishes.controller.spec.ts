import { Test, TestingModule } from '@nestjs/testing';
import { MerchantDishesController } from './merchant-dishes.controller';

describe('MerchantDishesController', () => {
  let controller: MerchantDishesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantDishesController],
    }).compile();

    controller = module.get<MerchantDishesController>(MerchantDishesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
