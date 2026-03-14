import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ClientService } from './client.service';

import {
  CreateClientDto,
  ClientDto,
  FindClientsQueryDto,
  UpdateClientDto,
} from './dtos';

import {
  ApiOperationFindAll,
  ApiOperationCreate,
  ApiOperationFindOneById,
  ApiMongoIdParam,
  PARAM_ID,
  ParamMongoId,
  ApiOperationDeleteOneById,
  ApiOperationUpdateOneById,
  IApiResult,
} from '../../common';

import { ClientDocument } from './schemas';
import { ColoristId } from '../auth/decorators';

@ApiTags('Client')
@ApiBearerAuth()
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperationCreate(ClientDto)
  @Post()
  async create(
    @Body() createClientData: CreateClientDto,
    @ColoristId() coloristId: string,
  ): Promise<ClientDocument> {
    return this.clientService.createClient({
      ...createClientData,
      coloristId,
    });
  }

  @ApiOperationFindAll(
    ClientDto,
    'Finds all the clients that meet the filtering criteria',
  )
  @Get()
  async findAll(
    @Query() query: FindClientsQueryDto,
    @ColoristId() coloristId: string,
  ): Promise<ClientDocument[]> {
    const { lastName, limit, name, skip } = query;

    return this.clientService.find(
      {
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
      },
      undefined,
      {
        limit,
        skip,
      },
    );
  }

  @ApiOperationFindOneById(ClientDto)
  @ApiMongoIdParam(PARAM_ID)
  @Get(`:${PARAM_ID}`)
  async findOneById(
    @ParamMongoId(PARAM_ID) _id: string,
    @ColoristId() coloristId: string,
  ): Promise<ClientDocument> {
    return this.clientService.findOne({
      _id,
      coloristId,
    });
  }

  @ApiOperationUpdateOneById()
  @ApiMongoIdParam()
  @Patch(`:${PARAM_ID}`)
  async update(
    @ParamMongoId(PARAM_ID) _id: string,
    @Body() updateClientData: UpdateClientDto,
    @ColoristId() coloristId: string,
  ): Promise<IApiResult> {
    await this.clientService.updateOne(
      {
        _id,
        coloristId,
      },
      { $set: updateClientData },
    );

    return { result: true };
  }

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @Delete(`:${PARAM_ID}`)
  async delete(
    @ParamMongoId(PARAM_ID) _id: string,
    @ColoristId() coloristId: string,
  ): Promise<IApiResult> {
    await this.clientService.deleteClient(_id, coloristId);

    return { result: true };
  }
}
