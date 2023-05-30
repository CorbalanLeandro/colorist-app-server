import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HairServiceService } from './hair-service.service';
import { IHairService } from './interfaces';

import {
  CreateHairServiceDto,
  HairServiceDto,
  UpdateHairServiceDto,
} from './dto';

import {
  ApiMongoIdParam,
  ApiOperationCreate,
  ApiOperationDeleteOneById,
  ApiOperationFindAll,
  ApiOperationUpdateOneById,
  IApiResult,
  PARAM_ID,
  ParamMongoId,
} from '../../common';

@ApiTags('Hair service')
@Controller('hair-service')
export class HairServiceController {
  constructor(private readonly hairServiceService: HairServiceService) {}

  private readonly coloristId = '6193e45824ec040624af509d'; // TODO get this from the request (auth);

  @ApiOperationCreate(HairServiceDto)
  @Post()
  async create(
    @Body() createHairServiceData: CreateHairServiceDto,
  ): Promise<IHairService> {
    return this.hairServiceService.create({
      ...createHairServiceData,
      coloristId: this.coloristId,
    });
  }

  @ApiOperationFindAll(
    HairServiceDto,
    'Finds all the hair services by sheet id',
  )
  @ApiMongoIdParam('sheet')
  @Get('sheet/:sheet')
  async findAllBySheet(
    @ParamMongoId('sheet') sheetId: string,
  ): Promise<IHairService[]> {
    return this.hairServiceService.find({
      coloristId: this.coloristId,
      sheet: sheetId,
    });
  }

  @ApiOperationUpdateOneById()
  @ApiMongoIdParam()
  @Patch(`:${PARAM_ID}`)
  async update(
    @ParamMongoId() id: string,
    @Body() updateHairServiceData: UpdateHairServiceDto,
  ): Promise<IApiResult> {
    await this.hairServiceService.updateOne(
      {
        _id: id,
        coloristId: this.coloristId,
      },
      { $set: updateHairServiceData },
    );

    return { result: true };
  }

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @Delete(`:${PARAM_ID}`)
  async delete(@ParamMongoId(PARAM_ID) id: string): Promise<IApiResult> {
    await this.hairServiceService.deleteOne({
      _id: id,
      coloristId: this.coloristId,
    });

    return { result: true };
  }
}
