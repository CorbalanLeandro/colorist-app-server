import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService } from '../../common';
import { ICreateClient } from './interfaces';
import { Client, ClientDocument } from './schemas';
import { SheetService } from '../sheet/sheet.service';

@Injectable()
export class ClientService extends AbstractService<
  ICreateClient,
  ClientDocument
> {
  constructor(
    @InjectModel(Client.name)
    protected model: Model<ClientDocument>,
    private readonly sheetService: SheetService,
  ) {
    super(ClientService.name, model);
  }

  async createClient(clientData: ICreateClient): Promise<ClientDocument> {
    return this.create(clientData);
  }

  async deleteClient(clientId: string, coloristId: string): Promise<void> {
    const session = await this.model.startSession();
    session.startTransaction();

    try {
      await this.deleteOne({ _id: clientId, coloristId }, session);
      await this.sheetService.deleteMany({ clientId, coloristId }, session);

      await session.commitTransaction();
    } catch (error) {
      this.logger.error('Could not delete client.', {
        clientId,
        coloristId,
        error,
      });

      await session.abortTransaction();
      throw new InternalServerErrorException('Could not delete the client.');
    } finally {
      await session.endSession();
    }
  }
}
