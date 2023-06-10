import { Test, TestingModule } from '@nestjs/testing';
import { ColoristController } from './colorist.controller';

describe('ColoristController', () => {
  let controller: ColoristController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColoristController],
    }).compile();

    controller = module.get<ColoristController>(ColoristController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
