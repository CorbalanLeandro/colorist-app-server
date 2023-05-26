import { Test, TestingModule } from '@nestjs/testing';

import { HairServiceController } from './hair-service.controller';
import { HairServiceService } from './hair-service.service';

describe('HairServiceController', () => {
  let controller: HairServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HairServiceController],
      providers: [HairServiceService],
    }).compile();

    controller = module.get<HairServiceController>(HairServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
