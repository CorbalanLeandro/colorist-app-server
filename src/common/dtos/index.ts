import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';

import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import {
  IApiResult,
  IBasicDocument,
  IBasicQueryDto,
  IBasicQueryWithSkipDto,
  ICursorQueryDto,
  ICursorResponse,
  IColoristId,
  IId,
  ITimestamps,
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

export class TimestampsDto implements ITimestamps {
  @ApiProperty({
    description: 'Document createdAt property',
    example: '2023-05-26T18:14:13.293Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Document updatedAt property',
    example: '2023-05-26T18:14:13.293Z',
  })
  @IsDate()
  updatedAt: Date;
}

export class BasicDocumentDto
  extends IntersectionType(TimestampsDto, IdResponseDto, VersionDto)
  implements IBasicDocument {}

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
    default: 10,
    description: 'limit attribute (positive number with no decimals)',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @IsQueryPositiveNumber()
  @Transform(({ value }) => Number(value))
  limit = 10;
}

export abstract class BasicQueryWithSkipDto
  extends BasicQueryDto
  implements IBasicQueryWithSkipDto
{
  @ApiPropertyOptional({
    description: 'skip attribute (positive number with no decimals)',
    example: 10,
  })
  @IsOptional()
  @IsQueryPositiveNumber()
  @Transform(({ value }) => Number(value))
  skip?: number;
}

export abstract class CursorQueryDto
  extends BasicQueryDto
  implements ICursorQueryDto
{
  @ApiPropertyOptional({
    description: 'Cursor for pagination (base64 encoded)',
    example:
      'MjAyMy0wNS0yOVQwMDowMDowMC4wMDBafDYxOTNlNDU4MjRlYzA0MDYyNGFmNTA5ZA==',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}

export abstract class CursorResponseDto<T> implements ICursorResponse<T> {
  @ApiProperty({
    description: 'List of items',
    isArray: true,
  })
  data: T[];

  @ApiPropertyOptional({
    description: 'Next cursor for pagination',
  })
  nextCursor?: string;

  @ApiProperty({
    description: 'Indicates if there are more results to fetch',
    example: true,
  })
  @IsBoolean()
  hasMore: boolean;
}
