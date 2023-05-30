import { Body, Controller, Post, Get, Delete, Patch } from '@nestjs/common';
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
  SheetDto,
  UpdateSheetDto,
} from './dtos';

import { ISheet } from './interfaces';

@ApiTags('Sheet')
@Controller('sheet')
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  private readonly coloristId = '6193e45824ec040624af509d'; // TODO get this from the request (auth);

  @ApiOperationCreate(CreateSheetResponseDto)
  @Post()
  async create(@Body() createSheetData: CreateSheetDto): Promise<ISheet> {
    return this.sheetService.create({
      ...createSheetData,
      coloristId: this.coloristId,
    });
  }

  @ApiOperationFindOneById(SheetDto)
  @ApiMongoIdParam(`${PARAM_ID}`)
  @Get(`/:${PARAM_ID}`)
  async findOne(@ParamMongoId(PARAM_ID) _id: string): Promise<ISheet[]> {
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
  @ApiMongoIdParam('client')
  @Get(`client/:client`)
  async findAllBySheet(
    @ParamMongoId('client') clientId: string,
  ): Promise<ISheet[]> {
    return this.sheetService.find(
      {
        client: clientId,
        coloristId: this.coloristId,
      },
      undefined,
      {
        populate: 'hairServices',
      },
    );
  }

  @ApiOperationUpdateOneById()
  @ApiMongoIdParam()
  @Patch(`:${PARAM_ID}`)
  async update(
    @ParamMongoId(PARAM_ID) id: string,
    @Body() updateSheetData: UpdateSheetDto,
  ): Promise<IApiResult> {
    await this.sheetService.updateOne(
      {
        _id: id,
        coloristId: this.coloristId,
      },
      { $set: updateSheetData },
    );

    return { result: true };
  }

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @Delete(`:${PARAM_ID}`)
  async delete(@ParamMongoId(PARAM_ID) id: string): Promise<IApiResult> {
    await this.sheetService.deleteOne({
      _id: id,
      coloristId: this.coloristId,
    });

    return { result: true };
  }
}
