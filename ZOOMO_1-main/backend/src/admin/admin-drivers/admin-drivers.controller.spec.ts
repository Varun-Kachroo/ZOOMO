import { Test, TestingModule } from '@nestjs/testing';
import { AdminDriversController } from './admin-drivers.controller';

describe('AdminDriversController', () => {
  let controller: AdminDriversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDriversController],
    }).compile();

    controller = module.get<AdminDriversController>(AdminDriversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
