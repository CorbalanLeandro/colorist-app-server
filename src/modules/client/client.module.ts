import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client, ClientSchema } from './schemas';
import { ColoristModule } from '../colorist/colorist.module';
import { SheetModule } from '../sheet/sheet.module';
import { HairServiceModule } from '../hair-service/hair-service.module';

@Module({
  controllers: [ClientController],
  exports: [ClientService],
  imports: [
    forwardRef(() => ColoristModule),
    forwardRef(() => HairServiceModule),
    forwardRef(() => SheetModule),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  providers: [ClientService],
})
export class ClientModule {}
