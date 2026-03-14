import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Colorist, ColoristSchema } from './schemas';
import { ColoristController } from './colorist.controller';
import { ColoristService } from './colorist.service';
import { ClientModule } from '../client/client.module';
import { SheetModule } from '../sheet/sheet.module';

@Module({
  controllers: [ColoristController],
  exports: [ColoristService],
  imports: [
    ClientModule,
    SheetModule,
    MongooseModule.forFeature([
      { name: Colorist.name, schema: ColoristSchema },
    ]),
  ],
  providers: [ColoristService],
})
export class ColoristModule {}
