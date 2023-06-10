import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SheetService } from './sheet.service';

import {
  ApiOperationCreate,
  ApiOperationFindAll,
  ApiMongoIdParam,
  PARAM_ID,
  ParamMongoId,
  ApiOperationDeleteOneById,
  ApiOperationUpdateOneById,
  IApiResult,
  ApiOperationFindOneById,
} from '../../common';

import {
  CreateSheetDto,
  CreateSheetResponseDto,
  FindSheetsQueryDto,
  SheetDto,
  UpdateSheetDto,
} from './dtos';

import { SheetDocument } from './schemas';
import { ColoristId } from '../auth/decorators';
import { SHEET_POPULATE_OPTIONS } from './constants';

@ApiTags('Sheet')
@ApiBearerAuth()
@Controller('sheet')
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @ApiOperationCreate(CreateSheetResponseDto)
  @Post()
  async create(
    @Body() createSheetData: CreateSheetDto,
    @ColoristId() coloristId: string,
  ): Promise<SheetDocument> {
    return this.sheetService.create({
      ...createSheetData,
      coloristId,
    });
  }

  @ApiOperationFindOneById(SheetDto)
  @ApiMongoIdParam(`${PARAM_ID}`)
  @Get(`/:${PARAM_ID}`)
  async findOne(
    @ParamMongoId(PARAM_ID) _id: string,
    @ColoristId() coloristId: string,
  ): Promise<SheetDocument[]> {
    return this.sheetService.find(
      {
        _id,
        coloristId,
      },
      undefined,
      SHEET_POPULATE_OPTIONS,
    );
  }

  @ApiOperationFindAll(SheetDto, 'Finds all the sheets by client id')
  @ApiMongoIdParam('clientId')
  @Get(`client/:clientId`)
  async findAllBySheet(
    @ParamMongoId('clientId') clientId: string,
    @Query() query: FindSheetsQueryDto,
    @ColoristId() coloristId: string,
  ): Promise<SheetDocument[]> {
    const { limit, skip } = query;

    return this.sheetService.find(
      {
        client: clientId,
        coloristId,
      },
      undefined,
      {
        limit,
        ...SHEET_POPULATE_OPTIONS,
        skip,
      },
    );
  }

  @ApiOperationUpdateOneById()
  @ApiMongoIdParam()
  @Patch(`:${PARAM_ID}`)
  async update(
    @ParamMongoId(PARAM_ID) _id: string,
    @Body() updateSheetData: UpdateSheetDto,
    @ColoristId() coloristId: string,
  ): Promise<IApiResult> {
    await this.sheetService.updateOne(
      {
        _id,
        coloristId,
      },
      { $set: updateSheetData },
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
    await this.sheetService.deleteOne({
      _id,
      coloristId,
    });

    return { result: true };
  }
}
