import { Injectable } from '@nestjs/common';
import { Model, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResult } from 'mongodb';

import { AbstractService, ICursorResponse, SortDirection } from '../../common';

import {
  IChangeClient,
  ICreateSheet,
  IDeleteSheet,
  IFindAllSheetsByClientIdOptions,
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

  async findAllSheetsByClientId(
    clientId: string,
    coloristId: string,
    options?: IFindAllSheetsByClientIdOptions,
  ): Promise<ICursorResponse<SheetDocument>> {
    const limit = options?.limit ?? 20;
    const cursorFilter = this.getCursorFilter(options?.cursor);

    const filter: QueryFilter<SheetDocument> = {
      clientId,
      coloristId,
      ...cursorFilter,
    };

    const sort: Record<string, SortDirection> = {
      /* eslint-disable sort-keys */
      date: options?.sort ?? SortDirection.DESC,
      _id: options?.sort ?? SortDirection.DESC,
      /* eslint-enable sort-keys */
    };

    const sheets = await this.find(filter, undefined, {
      limit: limit + 1,
      sort,
    });

    const hasMore = sheets.length > limit;

    if (hasMore) {
      sheets.pop();
    }

    const nextCursor = hasMore
      ? this.encodeCursor(sheets[sheets.length - 1])
      : undefined;

    return {
      data: sheets,
      hasMore,
      nextCursor,
    };
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

  private getCursorFilter(cursor?: string): QueryFilter<SheetDocument> {
    if (!cursor) {
      return {};
    }

    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
      const [dateStr, lastId] = decoded.split('|');

      if (!dateStr || !lastId) {
        return {};
      }

      const date = new Date(dateStr);

      if (isNaN(date.getTime())) {
        return {};
      }

      return {
        $or: [
          {
            /* eslint-disable-next-line sort-keys */
            _id: { $lt: lastId },
            date: { $eq: date },
          },
          { date: { $lt: date } },
        ],
      };
    } catch (error) {
      this.logger.error('Failed to parse cursor', { cursor, error });
      return {};
    }
  }

  private encodeCursor(sheet: SheetDocument): string {
    const cursorValue = `${sheet.date.toISOString()}|${sheet._id.toString()}`;
    return Buffer.from(cursorValue).toString('base64');
  }
}
