import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResult } from 'mongodb';

import {
  AbstractService,
  IPaginationOptions,
  SortDirection,
} from '../../common';

import {
  IChangeClient,
  ICreateSheet,
  IDeleteSheet,
  ISheet,
} from './interfaces';

import { Sheet, SheetDocument } from './schemas';

@Injectable()
export class SheetService extends AbstractService<ICreateSheet, SheetDocument> {
  constructor(
    @InjectModel(Sheet.name)
    protected model: Model<SheetDocument>,
  ) {
    super(SheetService.name, model);
  }

  async findByClientId(
    clientId: string,
    coloristId: string,
    options?: IPaginationOptions,
  ): Promise<SheetDocument[]> {
    const filter = { clientId, coloristId };
    const { limit, skip, sort } = options ?? {};

    if (sort) {
      return this.model.aggregate([
        { $match: filter },
        {
          $addFields: {
            dateAsDate: {
              $dateFromString: {
                dateString: '$date',
                format: '%d/%m/%Y',
              },
            },
          },
        },
        { $sort: { dateAsDate: sort === SortDirection.ASC ? 1 : -1 } },
        { $limit: limit ?? 0 },
        { $skip: skip ?? 0 },
        { $project: { dateAsDate: 0 } },
      ]);
    }

    return this.find(filter, undefined, { limit, skip });
  }

  async changeClient({
    coloristId,
    newClientId,
    oldClientId,
    sheetId,
  }: IChangeClient): Promise<UpdateResult> {
    return this.updateOne(
      { _id: sheetId, clientId: oldClientId, coloristId },
      { $set: { clientId: newClientId } },
    );
  }

  async createSheet(sheetData: ICreateSheet): Promise<ISheet> {
    return this.create(sheetData);
  }

  async deleteSheet({
    clientId,
    coloristId,
    sheetId,
  }: IDeleteSheet): Promise<void> {
    await this.deleteOne({ _id: sheetId, clientId, coloristId });
  }
}
