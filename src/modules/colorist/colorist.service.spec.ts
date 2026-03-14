import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ColoristService } from './colorist.service';
import { Colorist } from './schemas';
import { ClientService } from '../client/client.service';
import { SheetService } from '../sheet/sheet.service';

describe('ColoristService', () => {
  let service: ColoristService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColoristService,
        {
          provide: getModelToken(Colorist.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            deleteMany: jest.fn(),
            updateOne: jest.fn(),
            updateMany: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ClientService,
          useValue: {},
        },
        {
          provide: SheetService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ColoristService>(ColoristService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
