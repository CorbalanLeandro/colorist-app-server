import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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

@ApiTags('Sheet')
@Controller('sheet')
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  private readonly coloristId = '6483c569deebac0864aa2b28'; // TODO get this from the request (auth);

  @ApiOperationCreate(CreateSheetResponseDto)
  @Post()
  async create(
    @Body() createSheetData: CreateSheetDto,
  ): Promise<SheetDocument> {
    return this.sheetService.create({
      ...createSheetData,
      coloristId: this.coloristId,
    });
  }

  @ApiOperationFindOneById(SheetDto)
  @ApiMongoIdParam(`${PARAM_ID}`)
  @Get(`/:${PARAM_ID}`)
  async findOne(@ParamMongoId(PARAM_ID) _id: string): Promise<SheetDocument[]> {
    return this.sheetService.find(
      {
        _id,
        coloristId: this.coloristId,
      },
      undefined,
      {
        populate: 'hairServices',
      },
    );
  }

  @ApiOperationFindAll(SheetDto, 'Finds all the sheets by client id')
  @ApiMongoIdParam('clientId')
  @Get(`client/:clientId`)
  async findAllBySheet(
    @ParamMongoId('clientId') clientId: string,
    @Query() query: FindSheetsQueryDto,
  ): Promise<SheetDocument[]> {
    const { limit, skip } = query;

    return this.sheetService.find(
      {
        client: clientId,
        coloristId: this.coloristId,
      },
      undefined,
      {
        limit,
        populate: 'hairServices',
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
  ): Promise<IApiResult> {
    await this.sheetService.updateOne(
      {
        _id,
        coloristId: this.coloristId,
      },
      { $set: updateSheetData },
    );

    return { result: true };
  }

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @Delete(`:${PARAM_ID}`)
  async delete(@ParamMongoId(PARAM_ID) _id: string): Promise<IApiResult> {
    await this.sheetService.deleteOne({
      _id,
      coloristId: this.coloristId,
    });

    return { result: true };
  }
}
