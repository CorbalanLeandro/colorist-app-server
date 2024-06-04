import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResult } from 'mongodb';

import { AbstractService } from '../../common';

import {
  IChangeClient,
  ICreateSheet,
  IDeleteSheet,
  ISheet,
} from './interfaces';

import { Sheet, SheetDocument } from './schemas';
import { ClientService } from '../client/client.service';
import { ICreateClient } from '../client/interfaces';
import { ClientDocument } from '../client/schemas';

@Injectable()
export class SheetService extends AbstractService<ICreateSheet, SheetDocument> {
  constructor(
    @InjectModel(Sheet.name)
    protected model: Model<SheetDocument>,
    @Inject(forwardRef(() => ClientService))
    private readonly clientService: ClientService,
  ) {
    super(SheetService.name, model);
  }

  /**
   * @async
   * @param {IChangeClient} options
   * @returns {Promise<UpdateResult>}
   */
  async changeClient({
    coloristId,
    newClientId,
    oldClientId,
    sheetId,
  }: IChangeClient): Promise<UpdateResult> {
    await this.assertParentExist<ICreateClient, ClientDocument, ClientService>(
      newClientId,
      this.clientService,
    );

    const session = await this.model.startSession();
    session.startTransaction();

    try {
      // set the sheet on the new client and change the hair services
      // to the new client too
      await this.clientService.updateOne(
        { _id: newClientId, coloristId },
        { $push: { sheets: sheetId } },
        session,
      );

      // once the new client has the sheet, we remove it from the "old" client
      const updatedClient = await this.clientService.updateOne(
        { _id: oldClientId, coloristId },
        { $pull: { sheets: sheetId } },
        session,
      );

      await session.commitTransaction();
      return updatedClient;
    } catch (error) {
      this.logger.error('Error while changing sheet from client', {
        coloristId,
        error,
        newClientId,
        oldClientId,
      });

      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Creates a sheet and updates the client document to have this new sheet.
   *
   * @async
   * @param {ICreateSheet} sheetData
   * @returns {Promise<ISheet>} The created sheet
   */
  async createSheet(sheetData: ICreateSheet): Promise<ISheet> {
    return this.createAndUpdateParent<
      ICreateClient,
      ClientDocument,
      ClientService
    >(sheetData, this.clientService, sheetData.clientId, 'sheets');
  }

  /**
   * Deletes a sheet, all the hair services that belongs to it
   * and updates the client to not have this id anymore.
   *
   * @async
   * @param {IDeleteSheet} options
   * @returns {Promise<void>}
   */
  async deleteSheet({
    clientId,
    coloristId,
    sheetId,
  }: IDeleteSheet): Promise<void> {
    await this.assertParentExist<ICreateClient, ClientDocument, ClientService>(
      clientId,
      this.clientService,
    );

    const session = await this.model.startSession();
    session.startTransaction();

    try {
      await this.deleteOne({ _id: sheetId, coloristId }, session);
      await this.clientService.updateOne(
        { _id: clientId, coloristId },
        { $pull: { sheets: sheetId } },
        session,
      );

      await session.commitTransaction();
    } catch (error) {
      this.logger.error('Could not delete sheet', {
        clientId,
        coloristId,
        error,
        sheetId,
      });

      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
