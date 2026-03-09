import { Test, TestingModule } from '@nestjs/testing';
import { DriverOrdersService } from './orders.service';

describe('DriverOrdersService', () => {
  let service: DriverOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriverOrdersService],
    }).compile();

    service = module.get<DriverOrdersService>(DriverOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
