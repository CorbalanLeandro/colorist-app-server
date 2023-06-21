import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { Sheet, SheetSchema } from './schemas';
import { ClientModule } from '../client/client.module';
import { HairServiceModule } from '../hair-service/hair-service.module';

@Module({
  controllers: [SheetController],
  exports: [SheetService],
  imports: [
    forwardRef(() => ClientModule),
    forwardRef(() => HairServiceModule),
    MongooseModule.forFeature([{ name: Sheet.name, schema: SheetSchema }]),
  ],
  providers: [SheetService],
})
export class SheetModule {}
