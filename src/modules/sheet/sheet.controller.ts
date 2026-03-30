import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { SheetService } from './sheet.service';

import {
  ApiOperationCreate,
  ApiOperationFindAllWithCursor,
  ApiMongoIdParam,
  PARAM_ID,
  ParamMongoId,
  ApiOperationDeleteOneById,
  ApiOperationUpdateOneById,
  IApiResult,
  ApiOperationFindOneById,
  QueryMongoId,
  ApiMongoIdQuery,
  ResultResponseDto,
} from '../../common';

import {
  ChangeClientDto,
  CreateSheetDto,
  FindSheetsCursorQueryDto,
  SheetCursorResponseDto,
  SheetDto,
  UpdateSheetDto,
} from './dtos';

import { SheetDocument } from './schemas';
import { ColoristId } from '../auth/decorators';
import { ISheet } from './interfaces';

@ApiTags('Sheet')
@ApiBearerAuth()
@Controller('sheet')
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @ApiOperationCreate(SheetDto)
  @Post()
  async create(
    @Body() createSheetData: CreateSheetDto,
    @ColoristId() coloristId: string,
  ): Promise<ISheet> {
    return this.sheetService.createSheet({
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
  ): Promise<SheetDocument> {
    return this.sheetService.findOne({
      _id,
      coloristId,
    });
  }

  @ApiOperationFindAllWithCursor(
    SheetCursorResponseDto,
    'Finds all the sheets by client id with cursor pagination',
  )
  @ApiMongoIdParam('clientId')
  @Get(`client/:clientId`)
  async findAllSheetsByClientId(
    @ParamMongoId('clientId') clientId: string,
    @Query() query: FindSheetsCursorQueryDto,
    @ColoristId() coloristId: string,
  ): Promise<SheetCursorResponseDto> {
    const { cursor, limit, sort } = query;

    return this.sheetService.findAllSheetsByClientId(clientId, coloristId, {
      cursor,
      limit,
      sort,
    });
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

  @ApiOperation({
    description: 'Changes a Sheets client for another existent one.',
    summary: 'Changes a Sheets client.',
  })
  @ApiOkResponse({
    description: 'Result response indicating all went fine.',
    type: ResultResponseDto,
  })
  @ApiMongoIdParam()
  @Patch(`change-client/:${PARAM_ID}`)
  async changeClient(
    @ParamMongoId(PARAM_ID) _id: string,
    @Body() { newClientId, oldClientId }: ChangeClientDto,
    @ColoristId() coloristId: string,
  ): Promise<IApiResult> {
    await this.sheetService.changeClient({
      coloristId,
      newClientId,
      oldClientId,
      sheetId: _id,
    });

    return { result: true };
  }

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @ApiMongoIdQuery('clientId', 'Sheet parent id')
  @Delete(`:${PARAM_ID}`)
  async delete(
    @ParamMongoId(PARAM_ID) _id: string,
    @ColoristId() coloristId: string,
    @QueryMongoId('clientId') clientId: string,
  ): Promise<IApiResult> {
    await this.sheetService.deleteSheet({ clientId, coloristId, sheetId: _id });

    return { result: true };
  }
}
