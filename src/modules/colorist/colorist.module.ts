import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Colorist, ColoristSchema } from './schemas';
import { ColoristController } from './colorist.controller';
import { ColoristService } from './colorist.service';

@Module({
  controllers: [ColoristController],
  exports: [ColoristService],
  imports: [
    MongooseModule.forFeature([
      { name: Colorist.name, schema: ColoristSchema },
    ]),
  ],
  providers: [ColoristService],
})
export class ColoristModule {}
