import { Test, TestingModule } from '@nestjs/testing';

import { HairServiceService } from './hair-service.service';

describe('HairServiceService', () => {
  let service: HairServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HairServiceService],
    }).compile();

    service = module.get<HairServiceService>(HairServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
