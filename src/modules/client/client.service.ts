import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService } from '../../common';
import { ICreateClient } from './interfaces';
import { Client, ClientDocument } from './schemas';
import { ColoristService } from '../colorist/colorist.service';
import { SheetService } from '../sheet/sheet.service';
import { HairServiceService } from '../hair-service/hair-service.service';
import { ICreateColorist } from '../colorist/interfaces';
import { ColoristDocument } from '../colorist/schemas';

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
    @Inject(forwardRef(() => HairServiceService))
    private readonly hairServiceService: HairServiceService,
    @Inject(forwardRef(() => SheetService))
    private readonly sheetService: SheetService,
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
    return this.createAndUpdateParent<
      ICreateColorist,
      ColoristDocument,
      ColoristService
    >(clientData, this.coloristService, clientData.coloristId, 'clients');
  }

  /**
   * Deletes a Client, its all its related data and updates the colorist
   * to not have its _id anymore.
   *
   * @async
   * @param {string} clientId
   * @param {string} coloristId
   * @returns {Promise<void>}
   */
  async deleteClient(clientId: string, coloristId: string): Promise<void> {
    await this.assertParentExist<
      ICreateColorist,
      ColoristDocument,
      ColoristService
    >(coloristId, this.coloristService);

    await this.deleteOne({ _id: clientId, coloristId });

    const logCtx = {
      clientId,
      coloristId,
    };

    try {
      await Promise.all([
        this.sheetService.deleteMany({ clientId, coloristId }),
        this.hairServiceService.deleteMany({ clientId, coloristId }),
      ]);
    } catch (error) {
      this.logger.error('An error ocurred while deleting Client related data', {
        ...logCtx,
        error,
      });
    }

    try {
      await this.coloristService.updateOne(
        { _id: coloristId },
        { $pull: { clients: clientId } },
      );
    } catch (error) {
      this.logger.error('Could not remove client from colorist', {
        ...logCtx,
        error,
      });

      throw error;
    }
  }
}
