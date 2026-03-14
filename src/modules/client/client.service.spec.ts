import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { Client } from './schemas';
import { SheetService } from '../sheet/sheet.service';

describe('ClientService', () => {
  let service: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getModelToken(Client.name),
          useValue: {
            create: jest.fn(),
            deleteMany: jest.fn(),
            deleteOne: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateMany: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: SheetService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
