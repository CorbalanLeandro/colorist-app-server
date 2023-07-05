import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  ApiOperationCreate,
  ApiOperationFindOneById,
  ApiOperationUpdateOneById,
  IApiResult,
  ApiOperationDeleteOneById,
  ResultResponseDto,
} from '../../common';

import { ColoristService } from './colorist.service';

import {
  CreateColoristResponseDto,
  CreateColoristDto,
  ColoristDto,
  UpdateColoristDto,
  ChangePasswordDto,
} from './dtos';

import { ColoristDocument } from './schemas';

import {
  COLORIST_BASE_PROJECTIONS,
  COLORIST_POPULATE_OPTIONS,
} from './constants';

import { ColoristId, Public } from '../auth/decorators';
import { ICreateColoristResponseDto } from './interfaces';
import { UniqueColoristValidationPipe } from './pipes/unique-colorist-validation.pipe';

@ApiTags('Colorist')
@Controller('colorist')
export class ColoristController {
  constructor(private readonly coloristService: ColoristService) {}

  @ApiOperationCreate(CreateColoristResponseDto)
  @Public()
  @Post()
  async create(
    @Body(UniqueColoristValidationPipe) createColoristData: CreateColoristDto,
  ): Promise<ICreateColoristResponseDto> {
    return this.coloristService.createColorist(createColoristData);
  }

  @ApiBearerAuth()
  @ApiOperationFindOneById(ColoristDto)
  @Get()
  async findOneById(
    @ColoristId() coloristId: string,
  ): Promise<ColoristDocument> {
    return this.coloristService.findOne(
      {
        _id: coloristId,
      },
      COLORIST_BASE_PROJECTIONS,
      COLORIST_POPULATE_OPTIONS,
    );
  }

  @ApiBearerAuth()
  @ApiOperationUpdateOneById()
  @Patch()
  async update(
    @ColoristId() coloristId: string,
    @Body() updateColoristData: UpdateColoristDto,
  ): Promise<IApiResult> {
    await this.coloristService.updateOne(
      {
        _id: coloristId,
      },
      { $set: updateColoristData },
    );

    return { result: true };
  }

  @ApiBearerAuth()
  @ApiOperation({
    description: 'Changes the colorist password checking the old one first.',
    summary: 'Changes the colorist password.',
  })
  @ApiOkResponse({
    description: 'Result response indicating all went fine.',
    type: ResultResponseDto,
  })
  @Patch('change-password')
  async changePassword(
    @ColoristId() coloristId: string,
    @Body() { newPassword, oldPassword }: ChangePasswordDto,
  ): Promise<IApiResult> {
    await this.coloristService.changePassword({
      coloristId,
      newPassword,
      oldPassword,
    });

    return { result: true };
  }

  @ApiBearerAuth()
  @ApiOperationDeleteOneById()
  @Delete()
  async delete(@ColoristId() coloristId: string): Promise<IApiResult> {
    await this.coloristService.deleteColorist(coloristId);

    return { result: true };
  }
}
