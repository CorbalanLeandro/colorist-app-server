import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { Sheet, SheetSchema } from './schemas';

@Module({
  controllers: [SheetController],
  exports: [SheetService],
  imports: [
    MongooseModule.forFeature([{ name: Sheet.name, schema: SheetSchema }]),
  ],
  providers: [SheetService],
})
export class SheetModule {}
