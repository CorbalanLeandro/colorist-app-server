import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

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
  ColoristSignInDto,
} from './dtos';

import { Colorist, ColoristDocument } from './schemas';
import {
  COLORIST_BASE_PROJECTIONS,
  COLORIST_POPULATE_OPTIONS,
} from './constants';

@ApiTags('Colorist')
@Controller('colorist')
export class ColoristController {
  constructor(private readonly coloristService: ColoristService) {}

  @ApiOperationCreate(CreateColoristResponseDto)
  @Post()
  async create(
    @Body() createColoristData: CreateColoristDto,
  ): Promise<ColoristDocument> {
    return this.coloristService.create(createColoristData);
  }

  @ApiOperationFindAll(ColoristDto, 'Finds all the Colorists')
  @Get()
  async findAll(): Promise<ColoristDocument[]> {
    return this.coloristService.find(
      undefined,
      COLORIST_BASE_PROJECTIONS,
      COLORIST_POPULATE_OPTIONS,
    );
  }

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

  @ApiOperationDeleteOneById()
  @ApiMongoIdParam()
  @Delete(`:${PARAM_ID}`)
  async delete(@ParamMongoId(PARAM_ID) _id: string): Promise<IApiResult> {
    await this.coloristService.deleteOne({
      _id,
    });

    return { result: true };
  }

  @ApiOperation({
    description:
      'Finds a colorist by email or username and return it if the password is correct.',
    summary: 'Finds a colorist and sign in.',
  })
  @ApiOkResponse({
    description: 'The Colorist singed in.',
    type: ColoristDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() signInData: ColoristSignInDto,
  ): Promise<ColoristDocument> {
    const { emailOrUsername, password } = signInData;

    try {
      return await this.coloristService.findOne(
        {
          $or: [
            {
              username: {
                $options: 'i',
                $regex: `^${emailOrUsername}$`,
              },
            },
            {
              email: {
                $options: 'i',
                $regex: `^${emailOrUsername}$`,
              },
            },
          ],
          password: Colorist.encryptPassword(password),
        },
        COLORIST_BASE_PROJECTIONS,
        COLORIST_POPULATE_OPTIONS,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Credentials are invalid.');
      }

      throw error;
    }
  }
}
