import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ClientService } from './client.service';

import {
  ClientDto,
  CreateClientDto,
  CreateClientResponseDto,
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

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  private readonly coloristId = '6193e45824ec040624af509d'; // TODO get this from the request (auth);

  @ApiOperationCreate(CreateClientResponseDto)
  @Post()
  async create(
    @Body() createClientData: CreateClientDto,
  ): Promise<ClientDocument> {
    return this.clientService.create({
      ...createClientData,
      coloristId: this.coloristId,
    });
  }

  @ApiOperationFindAll(
    ClientDto,
    'Finds all the clients that meet the filtering criteria',
  )
  @Get()
  async findAll(
    @Query() query: FindClientsQueryDto,
  ): Promise<ClientDocument[]> {
    const { lastName, limit, name, skip } = query;

    return this.clientService.find(
      {
        coloristId: this.coloristId,
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
  ): Promise<ClientDocument> {
    return this.clientService.findOne({
      _id,
      coloristId: this.coloristId,
    });
  }

  @ApiOperationUpdateOneById()
  @ApiMongoIdParam()
  @Patch(`:${PARAM_ID}`)
  async update(
    @ParamMongoId(PARAM_ID) _id: string,
    @Body() updateHairServiceData: UpdateClientDto,
  ): Promise<IApiResult> {
    await this.clientService.updateOne(
      {
        _id,
        coloristId: this.coloristId,
      },
      { $set: updateHairServiceData },
    );

    return { result: true };
  }

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @Delete(`:${PARAM_ID}`)
  async delete(@ParamMongoId(PARAM_ID) _id: string): Promise<IApiResult> {
    await this.clientService.deleteOne({
      _id,
      coloristId: this.coloristId,
    });

    return { result: true };
  }
}
