import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService } from '../../common';
import { ICreateClient } from './interfaces';
import { Client, ClientDocument } from './schemas';
import { ColoristService } from '../colorist/colorist.service';

@Injectable()
export class ClientService extends AbstractService<
  ICreateClient,
  ClientDocument
> {
  constructor(
    @InjectModel(Client.name)
    protected model: Model<ClientDocument>,
    @Inject(forwardRef(() => ColoristService))
    private readonly coloristService: ColoristService,
  ) {
    super(ClientService.name, model);
  }

  /**
   * Creates a client and updates the colorist document to have this new client.
   *
   * @async
   * @param {ICreateClient} clientData
   * @returns {Promise<ClientDocument>} The created client
   */
  async createClient(clientData: ICreateClient): Promise<ClientDocument> {
    const newClient = await this.create(clientData);

    const { coloristId } = clientData;
    const { _id: newClientId } = newClient;

    try {
      await this.coloristService.updateOne(
        { _id: coloristId },
        { $push: { clients: newClientId } },
      );
    } catch (error) {
      this.logger.error('Could not add the new client to the Colorist', {
        coloristId,
        error,
        newClientId,
      });

      await this.deleteOne({ _id: newClientId });

      throw new InternalServerErrorException(
        'Something went wrong when creating the Client.',
      );
    }

    return newClient;
  }
}
