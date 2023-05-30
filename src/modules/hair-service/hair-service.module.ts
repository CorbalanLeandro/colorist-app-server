import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HairServiceService } from './hair-service.service';
import { HairServiceController } from './hair-service.controller';
import { HairService, HairServiceSchema } from './schemas';

@Module({
  controllers: [HairServiceController],
  exports: [HairServiceService],
  imports: [
    MongooseModule.forFeature([
      { name: HairService.name, schema: HairServiceSchema },
    ]),
  ],
  providers: [HairServiceService],
})
export class HairServiceModule {}
