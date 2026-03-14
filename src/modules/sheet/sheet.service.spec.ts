import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SheetService } from './sheet.service';
import { Sheet } from './schemas';

describe('SheetService', () => {
  let service: SheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SheetService,
        {
          provide: getModelToken(Sheet.name),
          useValue: {
            aggregate: jest.fn(),
            create: jest.fn(),
            deleteMany: jest.fn(),
            deleteOne: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateMany: jest.fn(),
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SheetService>(SheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
