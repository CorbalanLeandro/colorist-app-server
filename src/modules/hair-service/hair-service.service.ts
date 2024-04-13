import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService } from '../../common';
import { ICreateHairService, IDeleteHairService } from './interfaces';
import { HairService, HairServiceDocument } from './schemas';
import { ICreateSheet } from '../sheet/interfaces';
import { SheetDocument } from '../sheet/schemas';
import { SheetService } from '../sheet/sheet.service';

@Injectable()
export class HairServiceService extends AbstractService<
  ICreateHairService,
  HairServiceDocument
> {
  constructor(
    @InjectModel(HairService.name)
    protected model: Model<HairServiceDocument>,
    @Inject(forwardRef(() => SheetService))
    private readonly sheetService: SheetService,
  ) {
    super(HairServiceService.name, model);
  }

  /**
   * Creates a hair service and updates the sheet document to have this new hair service.
   *
   * @async
   * @param {ICreateHairService} hairServiceData
   * @returns {Promise<HairServiceDocument>} The created hair service
   */
  async createHairService(
    hairServiceData: ICreateHairService,
  ): Promise<HairServiceDocument> {
    return this.createAndUpdateParent<
      ICreateSheet,
      SheetDocument,
      SheetService
    >(
      hairServiceData,
      this.sheetService,
      hairServiceData.sheetId,
      'hairServices',
    );
  }

  /**
   * Deletes a hair service by id and updates the parent sheet to not have this id anymore
   *
   * @param {IDeleteHairService} options
   * @returns {Promise<void>}
   */
  async deleteHairService({
    hairServiceId,
    sheetId,
    coloristId,
  }: IDeleteHairService): Promise<void> {
    await this.assertParentExist<ICreateSheet, SheetDocument, SheetService>(
      sheetId,
      this.sheetService,
    );

    const session = await this.model.startSession();
    session.startTransaction();

    try {
      await this.deleteOne({ _id: hairServiceId }, session);
      await this.sheetService.updateOne(
        { _id: sheetId, coloristId },
        { $pull: { hairServices: hairServiceId } },
        session,
      );

      await session.commitTransaction();
    } catch (error) {
      this.logger.error('Could not remove hair service from sheet', {
        coloristId,
        error,
        hairServiceId,
        sheetId,
      });

      await session.abortTransaction();

      throw error;
    } finally {
      await session.endSession();
    }
  }
}
