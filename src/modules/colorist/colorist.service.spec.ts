import { Test, TestingModule } from '@nestjs/testing';
import { ColoristService } from './colorist.service';

describe('ColoristService', () => {
  let service: ColoristService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColoristService],
    }).compile();

    service = module.get<ColoristService>(ColoristService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
