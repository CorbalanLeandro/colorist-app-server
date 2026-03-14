import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ColoristController } from './colorist.controller';
import { ColoristService } from './colorist.service';
import { Colorist } from './schemas';
import { UniqueColoristValidationPipe } from './pipes/unique-colorist-validation.pipe';
import { ClientService } from '../client/client.service';
import { SheetService } from '../sheet/sheet.service';

describe('ColoristController', () => {
  let controller: ColoristController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColoristController],
      providers: [
        ColoristService,
        {
          provide: getModelToken(Colorist.name),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
        {
          provide: ClientService,
          useValue: {},
        },
        {
          provide: SheetService,
          useValue: {},
        },
        {
          provide: UniqueColoristValidationPipe,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ColoristController>(ColoristController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
