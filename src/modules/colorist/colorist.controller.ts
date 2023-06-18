import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  ApiOperationCreate,
  ApiOperationFindOneById,
  ApiMongoIdParam,
  PARAM_ID,
  ParamMongoId,
  ApiOperationUpdateOneById,
  IApiResult,
  ApiOperationDeleteOneById,
  ApiOperationFindAll,
} from '../../common';

import { ColoristService } from './colorist.service';

import {
  CreateColoristResponseDto,
  CreateColoristDto,
  ColoristDto,
  UpdateColoristDto,
} from './dtos';

import { ColoristDocument } from './schemas';

import {
  COLORIST_BASE_PROJECTIONS,
  COLORIST_POPULATE_OPTIONS,
} from './constants';

import { Public } from '../auth/decorators';
import { ICreateColoristResponseDto } from './interfaces';

@ApiTags('Colorist')
@Controller('colorist')
export class ColoristController {
  constructor(private readonly coloristService: ColoristService) {}

  @ApiOperationCreate(CreateColoristResponseDto)
  @Public()
  @Post()
  async create(
    @Body() createColoristData: CreateColoristDto,
  ): Promise<ICreateColoristResponseDto> {
    return this.coloristService.createColorist(createColoristData);
  }

  @ApiBearerAuth()
  @ApiOperationFindAll(ColoristDto, 'Finds all the Colorists')
  @Get()
  async findAll(): Promise<ColoristDocument[]> {
    return this.coloristService.find(
      undefined,
      COLORIST_BASE_PROJECTIONS,
      COLORIST_POPULATE_OPTIONS,
    );
  }

  @ApiBearerAuth()
  @ApiOperationFindOneById(ColoristDto)
  @ApiMongoIdParam(PARAM_ID)
  @Get(`:${PARAM_ID}`)
  async findOneById(
    @ParamMongoId(PARAM_ID) _id: string,
  ): Promise<ColoristDocument> {
    return this.coloristService.findOne(
      {
        _id,
      },
      COLORIST_BASE_PROJECTIONS,
      COLORIST_POPULATE_OPTIONS,
    );
  }

  @ApiBearerAuth()
  @ApiOperationUpdateOneById()
  @ApiMongoIdParam()
  @Patch(`:${PARAM_ID}`)
  async update(
    @ParamMongoId(PARAM_ID) _id: string,
    @Body() updateColoristData: UpdateColoristDto,
  ): Promise<IApiResult> {
    await this.coloristService.updateOne(
      {
        _id,
      },
      { $set: updateColoristData },
    );

    return { result: true };
  }

  @ApiBearerAuth()
  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @Delete(`:${PARAM_ID}`)
  async delete(@ParamMongoId(PARAM_ID) _id: string): Promise<IApiResult> {
    await this.coloristService.deleteOne({
      _id,
    });

    return { result: true };
  }
}
