import { Module } from '@nestjs/common';

import { HairServiceService } from './hair-service.service';
import { HairServiceController } from './hair-service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HairService, HairServiceSchema } from './schemas';

@Module({
  controllers: [HairServiceController],
  imports: [
    MongooseModule.forFeature([
      { name: HairService.name, schema: HairServiceSchema },
    ]),
  ],
  providers: [HairServiceService],
})
export class HairServiceModule {}
