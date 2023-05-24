import { Module } from '@nestjs/common';

import { HairServiceService } from './hair-service.service';
import { HairServiceController } from './hair-service.controller';

@Module({
  controllers: [HairServiceController],
  providers: [HairServiceService],
})
export class HairServiceModule {}
