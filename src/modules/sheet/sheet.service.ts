import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService } from '../../common';
import { ICreateSheet } from './interfaces';
import { Sheet, SheetDocument } from './schemas';
import { ClientService } from '../client/client.service';
import { ICreateClient } from '../client/interfaces';
import { ClientDocument } from '../client/schemas';
import { HairServiceService } from '../hair-service/hair-service.service';

@Injectable()
export class SheetService extends AbstractService<ICreateSheet, SheetDocument> {
  constructor(
    @InjectModel(Sheet.name)
    protected model: Model<SheetDocument>,
    @Inject(forwardRef(() => ClientService))
    private readonly clientService: ClientService,
    @Inject(forwardRef(() => HairServiceService))
    private readonly hairServiceService: HairServiceService,
  ) {
    super(SheetService.name, model);
  }

  /**
   * Creates a sheet and updates the client document to have this new sheet.
   *
   * @async
   * @param {ICreateSheet} sheetData
   * @returns {Promise<SheetDocument>} The created sheet
   */
  async createSheet(sheetData: ICreateSheet): Promise<SheetDocument> {
    return this.createAndUpdateParent<
      ICreateClient,
      ClientDocument,
      ClientService
    >(sheetData, this.clientService, sheetData.clientId, 'sheets');
  }

  /**
   * Deletes a sheet and all the hair services that belongs to it.
   *
   * @async
   * @param {string} _id Sheet's id
   * @param {string} coloristId
   * @returns {Promise<void>}
   */
  async deleteSheet(_id: string, coloristId: string): Promise<void> {
    await Promise.all([
      this.deleteOne({ _id, coloristId }),
      this.hairServiceService.deleteMany({ coloristId, sheetId: _id }),
    ]);
  }
}
