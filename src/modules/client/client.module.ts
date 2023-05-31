import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client, ClientSchema } from './schemas';

@Module({
  controllers: [ClientController],
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  providers: [ClientService],
})
export class ClientModule {}
