import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';

import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsPositive,
} from 'class-validator';

import {
  IApiResult,
  IBasicDocumentDto,
  IBasicQueryDto,
  IColoristId,
  IId,
  ITimestampsDto,
  IVersion,
} from '../interfaces';

import { IsQueryPositiveNumber } from '../decorators/validation.decorators';
import { Transform } from 'class-transformer';

export class IdResponseDto implements IId {
  @ApiProperty({
    description: 'Document _id',
    example: '61e57d30c748d8f18de310b2',
  })
  @IsMongoId()
  _id: string;
}

export class VersionDto implements IVersion {
  @ApiProperty({
    description: 'Document version',
    example: 2,
  })
  @IsPositive()
  __v: number;
}

export class TimestampsDto implements ITimestampsDto {
  @ApiProperty({
    description: 'Document createdAt property (ISO8601 date string)',
    example: '2023-05-26T18:14:13.293Z',
  })
  @IsDateString()
  createdAt: string;

  @ApiProperty({
    description: 'Document updatedAt property (ISO8601 date string)',
    example: '2023-05-26T18:14:13.293Z',
  })
  @IsDateString()
  updatedAt: string;
}

export class BasicDocumentDto
  extends IntersectionType(TimestampsDto, IdResponseDto, VersionDto)
  implements IBasicDocumentDto {}

export class ResultResponseDto implements IApiResult {
  @ApiProperty({
    description: 'Result attribute indicating all went fine',
    example: true,
    required: true,
  })
  @IsBoolean()
  result: true;
}

export class ColoristIdDto implements IColoristId {
  @ApiProperty({
    description:
      'coloristId attribute, used to link the document to a colorist',
    example: '6193e45824ec040624af509d',
    type: String,
  })
  @IsMongoId()
  coloristId: string;
}

export abstract class BasicQueryDto implements IBasicQueryDto {
  @ApiPropertyOptional({
    description: 'limit attribute (positive number with no decimals)',
    example: 10,
  })
  @IsOptional()
  @IsQueryPositiveNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @ApiPropertyOptional({
    description: 'skip attribute (positive number with no decimals)',
    example: 10,
  })
  @IsOptional()
  @IsQueryPositiveNumber()
  @Transform(({ value }) => Number(value))
  skip?: number;
}
