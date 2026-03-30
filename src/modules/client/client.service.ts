import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model, PipelineStage, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService, ICursorResponse } from '../../common';
import { ICreateClient, IFindClientsCursorQueryDto } from './interfaces';
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

  async findAllColoristClients(
    coloristId: string,
    options: IFindClientsCursorQueryDto,
  ): Promise<ICursorResponse<ClientDocument>> {
    const { cursor, lastName, limit, name } = options;

    const userFilters: QueryFilter<ClientDocument> = {
      coloristId,
      ...(name && {
        name: {
          $options: 'i',
          $regex: `^${name}`,
        },
      }),
      ...(lastName && {
        lastName: {
          $options: 'i',
          $regex: `^${lastName}`,
        },
      }),
    };

    const pipeline: PipelineStage[] = [
      { $match: userFilters },
      {
        /* eslint-disable sort-keys */
        $addFields: {
          lastNameLower: { $toLower: '$lastName' },
          nameLower: { $toLower: '$name' },
        },
      },
      {
        $sort: {
          lastNameLower: 1,
          nameLower: 1,
          _id: 1,
        },
        /* eslint-enable sort-keys */
      },
    ];

    const cursorFilter = this.getCursorFilter(cursor);
    if (cursorFilter && Object.keys(cursorFilter).length > 0) {
      pipeline.push({ $match: cursorFilter });
    }

    pipeline.push({ $limit: limit + 1 });

    const clients = await this.model.aggregate(pipeline);

    const hasMore = clients.length > limit;

    if (hasMore) {
      clients.pop();
    }

    const nextCursor = hasMore
      ? this.encodeCursor(clients[clients.length - 1])
      : undefined;

    return {
      data: clients,
      hasMore,
      nextCursor,
    };
  }

  private getCursorFilter(cursor?: string): QueryFilter<ClientDocument> {
    if (!cursor) {
      return {};
    }

    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
      const [lastName, name, lastId] = decoded.split('|');

      if (!lastName || !name || !lastId) {
        return {};
      }

      const lastNameLower = lastName.toLowerCase();
      const nameLower = name.toLowerCase();

      return {
        /* eslint-disable sort-keys */
        $or: [
          {
            lastNameLower: { $gt: lastNameLower },
            nameLower: { $gte: nameLower },
            _id: { $gt: lastId },
          },
          { lastNameLower: { $gt: lastNameLower } },
          {
            lastNameLower: { $eq: lastNameLower },
            nameLower: { $gt: nameLower },
          },
        ],
        /* eslint-enable sort-keys */
      };
    } catch (error) {
      this.logger.error('Failed to parse cursor', { cursor, error });
      return {};
    }
  }

  private encodeCursor(client: ClientDocument): string {
    const cursorValue = `${client.lastName?.toLowerCase()}|${client.name?.toLowerCase()}|${client._id.toString()}`;
    return Buffer.from(cursorValue).toString('base64');
  }
}
