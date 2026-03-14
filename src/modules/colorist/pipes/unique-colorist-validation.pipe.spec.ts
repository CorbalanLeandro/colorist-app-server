import { Test, TestingModule } from '@nestjs/testing';
import { UniqueColoristValidationPipe } from './unique-colorist-validation.pipe';
import { ColoristService } from '../colorist.service';

describe('UniqueColoristValidationPipe', () => {
  let pipe: UniqueColoristValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniqueColoristValidationPipe,
        {
          provide: ColoristService,
          useValue: {},
        },
      ],
    }).compile();

    pipe = module.get<UniqueColoristValidationPipe>(
      UniqueColoristValidationPipe,
    );
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
