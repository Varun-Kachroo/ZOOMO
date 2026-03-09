import { Test, TestingModule } from '@nestjs/testing';
import { DriverOrdersController } from './orders.controller';

describe('OrdersController', () => {
  let controller: DriverOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverOrdersController],
    }).compile();

    controller = module.get<DriverOrdersController>(DriverOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
