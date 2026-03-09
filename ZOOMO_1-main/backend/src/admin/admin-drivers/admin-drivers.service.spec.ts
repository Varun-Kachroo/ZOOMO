import { Test, TestingModule } from '@nestjs/testing';
import { AdminDriversService } from './admin-drivers.service';

describe('AdminDriversService', () => {
  let service: AdminDriversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminDriversService],
    }).compile();

    service = module.get<AdminDriversService>(AdminDriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
