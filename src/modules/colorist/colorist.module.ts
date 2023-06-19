import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Colorist, ColoristSchema } from './schemas';
import { ColoristController } from './colorist.controller';
import { ColoristService } from './colorist.service';
import { ClientModule } from '../client/client.module';
import { SheetModule } from '../sheet/sheet.module';
import { HairServiceModule } from '../hair-service/hair-service.module';

@Module({
  controllers: [ColoristController],
  exports: [ColoristService],
  imports: [
    forwardRef(() => ClientModule),
    MongooseModule.forFeature([
      { name: Colorist.name, schema: ColoristSchema },
    ]),
    SheetModule,
    HairServiceModule,
  ],
  providers: [ColoristService],
})
export class ColoristModule {}
