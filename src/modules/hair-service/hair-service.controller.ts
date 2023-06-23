import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { HairServiceService } from './hair-service.service';

import {
  CreateHairServiceDto,
  HairServiceDto,
  UpdateHairServiceDto,
} from './dtos';

import {
  ApiMongoIdParam,
  ApiMongoIdQuery,
  ApiOperationCreate,
  ApiOperationDeleteOneById,
  ApiOperationFindAll,
  ApiOperationFindOneById,
  ApiOperationUpdateOneById,
  IApiResult,
  PARAM_ID,
  ParamMongoId,
  QueryMongoId,
} from '../../common';

import { HairServiceDocument } from './schemas';
import { ColoristId } from '../auth/decorators';

@ApiTags('Hair service')
@ApiBearerAuth()
@Controller('hair-service')
export class HairServiceController {
  constructor(private readonly hairServiceService: HairServiceService) {}

  @ApiOperationCreate(HairServiceDto)
  @Post()
  async create(
    @Body() createHairServiceData: CreateHairServiceDto,
    @ColoristId() coloristId: string,
  ): Promise<HairServiceDocument> {
    return this.hairServiceService.createHairService({
      ...createHairServiceData,
      coloristId,
    });
  }

  @ApiOperationFindAll(
    HairServiceDto,
    'Finds all the hair services by sheet id',
  )
  @ApiMongoIdParam('sheetId')
  @Get('sheet/:sheetId')
  async findAllBySheet(
    @ParamMongoId('sheetId') sheetId: string,
    @ColoristId() coloristId: string,
  ): Promise<HairServiceDocument[]> {
    return this.hairServiceService.find({
      coloristId,
      sheet: sheetId,
    });
  }

  @ApiOperationFindOneById(HairServiceDto)
  @ApiMongoIdParam(PARAM_ID)
  @Get(`:${PARAM_ID}`)
  async findOneById(
    @ParamMongoId(PARAM_ID) _id: string,
    @ColoristId() coloristId: string,
  ): Promise<HairServiceDocument> {
    return this.hairServiceService.findOne({
      _id,
      coloristId,
    });
  }

  @ApiOperationUpdateOneById()
  @ApiMongoIdParam()
  @Patch(`:${PARAM_ID}`)
  async update(
    @ParamMongoId(PARAM_ID) _id: string,
    @Body() updateHairServiceData: UpdateHairServiceDto,
    @ColoristId() coloristId: string,
  ): Promise<IApiResult> {
    await this.hairServiceService.updateOne(
      {
        _id,
        coloristId,
      },
      { $set: updateHairServiceData },
    );

    return { result: true };
  }

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @ApiMongoIdQuery('sheetId', 'Hair service parent id')
  @Delete(`:${PARAM_ID}`)
  async delete(
    @ParamMongoId(PARAM_ID) _id: string,
    @ColoristId() coloristId: string,
    @QueryMongoId('sheetId') sheetId: string,
  ): Promise<IApiResult> {
    await this.hairServiceService.deleteHairService({
      coloristId,
      hairServiceId: _id,
      sheetId,
    });

    return { result: true };
  }
}
