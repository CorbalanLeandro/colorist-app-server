import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
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

    // set the sheet on the new client and change the hair services
    // to the new client too
    await Promise.all([
      this.clientService.updateOne(
        { _id: newClientId, coloristId },
        { $push: { sheets: sheetId } },
      ),
      this.hairServiceService.updateMany(
        { clientId: oldClientId, coloristId, sheetId },
        { $set: { clientId: newClientId } },
      ),
    ]);

    // once the new client has the sheet, we remove it from the "old" client
    return this.clientService.updateOne(
      { _id: oldClientId, coloristId },
      { $pull: { sheets: sheetId } },
    );
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
    const { hairServices: hairServicesData, ...sheetData } =
      sheetWithHairServicesData;
    const createdSheet = await this.createAndUpdateParent<
      ICreateClient,
      ClientDocument,
      ClientService
    >(sheetData, this.clientService, sheetData.clientId, 'sheets');

    let createdHairServices: HairServiceDocument[] = [];

    try {
      createdHairServices = await this.createSheetHairServices(
        createdSheet,
        hairServicesData,
      );
    } catch (error) {
      this.logger.error('Could not create sheets hair services.', {
        coloristId: createdSheet.coloristId,
        createdSheet,
        error,
        hairServicesData,
      });
    }

    return { ...createdSheet.toObject(), hairServices: createdHairServices };
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

    await this.deleteOne({ _id: sheetId, coloristId });

    const logCtx = {
      clientId,
      coloristId,
      sheetId,
    };

    try {
      await this.hairServiceService.deleteMany({
        coloristId,
        sheetId,
      });
    } catch (error) {
      this.logger.error(`Could not delete sheet's hair services`, {
        ...logCtx,
        error,
      });

      throw error;
    }

    try {
      await this.clientService.updateOne(
        { _id: clientId, coloristId },
        { $pull: { sheets: sheetId } },
      );
    } catch (error) {
      this.logger.error('Could not remove sheet from client', {
        ...logCtx,
        error,
      });

      throw error;
    }
  }

  /**
   * Creates the hair services for the provided Sheet.
   *
   * @param {SheetDocument} createdSheet
   * @param {ICreateHairServiceInSheet[]} hairServices
   * @returns {Promise<HairServiceDocument[]>}
   */
  private async createSheetHairServices(
    createdSheet: SheetDocument,
    hairServicesData: ICreateHairServiceInSheet[],
  ): Promise<HairServiceDocument[]> {
    const { clientId, _id: sheetId, coloristId } = createdSheet;

    const createHairServicePromises: Promise<HairServiceDocument>[] = [];
    for (const hairServiceData of hairServicesData) {
      createHairServicePromises.push(
        this.hairServiceService.create({
          ...hairServiceData,
          clientId,
          coloristId,
          sheetId,
        }),
      );
    }

    const createdHairServices = await Promise.all(createHairServicePromises);

    const createdHairServicesIds: string[] = [];
    for (const createdHairService of createdHairServices) {
      createdHairServicesIds.push(createdHairService._id);
    }

    await this.updateOne(
      { _id: sheetId },
      { $push: { hairServices: createdHairServicesIds } },
    );

    return createdHairServices;
  }
}
