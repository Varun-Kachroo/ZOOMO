import { Test, TestingModule } from '@nestjs/testing';
import { MerchantOrdersController } from './merchant-orders.controller';

describe('MerchantOrdersController', () => {
  let controller: MerchantOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantOrdersController],
    }).compile();

    controller = module.get<MerchantOrdersController>(MerchantOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
