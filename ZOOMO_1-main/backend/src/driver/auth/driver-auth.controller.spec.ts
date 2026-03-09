import { Test, TestingModule } from '@nestjs/testing';
import { DriverAuthController } from './driver-auth.controller';

describe('DriverAuthController', () => {
  let controller: DriverAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverAuthController],
    }).compile();

    controller = module.get<DriverAuthController>(DriverAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
