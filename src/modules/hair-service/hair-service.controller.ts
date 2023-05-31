import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HairServiceService } from './hair-service.service';

import {
  CreateHairServiceDto,
  HairServiceDto,
  UpdateHairServiceDto,
} from './dtos';

import {
  ApiMongoIdParam,
  ApiOperationCreate,
  ApiOperationDeleteOneById,
  ApiOperationFindAll,
  ApiOperationFindOneById,
  ApiOperationUpdateOneById,
  IApiResult,
  PARAM_ID,
  ParamMongoId,
} from '../../common';

import { HairServiceDocument } from './schemas';

@ApiTags('Hair service')
@Controller('hair-service')
export class HairServiceController {
  constructor(private readonly hairServiceService: HairServiceService) {}

  private readonly coloristId = '6193e45824ec040624af509d'; // TODO get this from the request (auth);

  @ApiOperationCreate(HairServiceDto)
  @Post()
  async create(
    @Body() createHairServiceData: CreateHairServiceDto,
  ): Promise<HairServiceDocument> {
    return this.hairServiceService.create({
      ...createHairServiceData,
      coloristId: this.coloristId,
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
  ): Promise<HairServiceDocument[]> {
    return this.hairServiceService.find({
      coloristId: this.coloristId,
      sheet: sheetId,
    });
  }

  @ApiOperationFindOneById(HairServiceDto)
  @ApiMongoIdParam(PARAM_ID)
  @Get(`:${PARAM_ID}`)
  async findOneById(
    @ParamMongoId(PARAM_ID) _id: string,
  ): Promise<HairServiceDocument> {
    return this.hairServiceService.findOne({
      _id,
      coloristId: this.coloristId,
    });
  }

  @ApiOperationUpdateOneById()
  @ApiMongoIdParam()
  @Patch(`:${PARAM_ID}`)
  async update(
    @ParamMongoId(PARAM_ID) _id: string,
    @Body() updateHairServiceData: UpdateHairServiceDto,
  ): Promise<IApiResult> {
    await this.hairServiceService.updateOne(
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
    await this.hairServiceService.deleteOne({
      _id,
      coloristId: this.coloristId,
    });

    return { result: true };
  }
}
