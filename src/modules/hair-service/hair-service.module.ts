import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HairServiceService } from './hair-service.service';
import { HairServiceController } from './hair-service.controller';
import { HairService, HairServiceSchema } from './schemas';
import { SheetModule } from '../sheet/sheet.module';

@Module({
  controllers: [HairServiceController],
  exports: [HairServiceService],
  imports: [
    forwardRef(() => SheetModule),
    MongooseModule.forFeature([
      { name: HairService.name, schema: HairServiceSchema },
    ]),
  ],
  providers: [HairServiceService],
})
export class HairServiceModule {}
