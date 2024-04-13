import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ClientSession, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResult } from 'mongodb';

import { AbstractService } from '../../common';

import {
  IChangeClient,
  ICreateHairServiceInSheet,
  ICreateSheet,
  ICreateSheetWithHairServices,
  IDeleteSheet,
  ISheet,
} from './interfaces';

import { Sheet, SheetDocument } from './schemas';
import { ClientService } from '../client/client.service';
import { ICreateClient } from '../client/interfaces';
import { ClientDocument } from '../client/schemas';
import { HairServiceService } from '../hair-service/hair-service.service';
import { HairServiceDocument } from '../hair-service/schemas';

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
      await this.hairServiceService.updateMany(
        { clientId: oldClientId, coloristId, sheetId },
        { $set: { clientId: newClientId } },
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
   * @param {ICreateSheetWithHairServices} sheetWithHairServicesData
   * @returns {Promise<ISheet>} The created sheet
   */
  async createSheet(
    sheetWithHairServicesData: ICreateSheetWithHairServices,
  ): Promise<ISheet> {
    const session = await this.model.startSession();
    session.startTransaction();

    try {
      const { hairServices: hairServicesData, ...sheetData } =
        sheetWithHairServicesData;

      const createdSheet = await this.createAndUpdateParent<
        ICreateClient,
        ClientDocument,
        ClientService
      >(sheetData, this.clientService, sheetData.clientId, 'sheets', session);

      let createdHairServices: HairServiceDocument[] = [];

      createdHairServices = await this.createSheetHairServices(
        createdSheet,
        hairServicesData,
        session,
      );

      await session.commitTransaction();
      return { ...createdSheet.toObject(), hairServices: createdHairServices };
    } catch (error) {
      this.logger.error('Could not create sheets hair services.', {
        coloristId: sheetWithHairServicesData.coloristId,
        createSheetData: sheetWithHairServicesData,
        error,
      });

      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      if (!session.hasEnded) {
        await session.endSession();
      }
    }
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
      await this.hairServiceService.deleteMany(
        {
          coloristId,
          sheetId,
        },
        session,
      );
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

  /**
   * Creates the hair services for the provided Sheet and updates the sheet hair services array.
   *
   * @param {SheetDocument} createdSheet
   * @param {ICreateHairServiceInSheet[]} hairServicesData
   * @param {ClientSession} session Mongodb session
   * @returns {Promise<HairServiceDocument[]>}
   */
  private async createSheetHairServices(
    createdSheet: SheetDocument,
    hairServicesData: ICreateHairServiceInSheet[],
    session: ClientSession,
  ): Promise<HairServiceDocument[]> {
    const { clientId, _id: sheetId, coloristId } = createdSheet;

    const createdHairServices: HairServiceDocument[] = [];
    const createdHairServicesIds: string[] = [];

    for (const hairServiceData of hairServicesData) {
      const createdHairService = await this.hairServiceService.create(
        {
          ...hairServiceData,
          clientId,
          coloristId,
          sheetId,
        },
        session,
      );

      createdHairServices.push(createdHairService);
      createdHairServicesIds.push(createdHairService._id);
    }

    await this.updateOne(
      { _id: sheetId },
      { $push: { hairServices: createdHairServicesIds } },
      session,
    );

    return createdHairServices;
  }
}
