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
    @Body() createHairServiceDto: CreateHairServiceDto,
  ): Promise<IHairService> {
    return this.hairServiceService.create({
      ...createHairServiceDto,
      coloristId: this.coloristId,
    });
  }

  @ApiOperationFindAll(
    HairServiceDto,
    'Finds all the hair services by sheet id',
  )
  @ApiMongoIdParam()
  @Get(`sheet/:${PARAM_ID}`)
  async findAllBySheet(
    @ParamMongoId() sheetId: string,
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
    @Body() updateHairServiceDto: UpdateHairServiceDto,
  ): Promise<IApiResult> {
    await this.hairServiceService.updateOne(
      {
        _id: id,
        coloristId: this.coloristId,
      },
      updateHairServiceDto,
    );

    return { result: true };
  }

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @Delete(`:${PARAM_ID}`)
  async delete(@ParamMongoId() id: string): Promise<IApiResult> {
    await this.hairServiceService.deleteOne({
      _id: id,
      coloristId: this.coloristId,
    });

    return { result: true };
  }
}
