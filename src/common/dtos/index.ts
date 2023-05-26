import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsMongoId } from 'class-validator';

import {
  IApiResult,
  IBacicDocumentDto,
  IId,
  ITimestampsDto,
} from '../interfaces';

export class IdResponseDto implements IId {
  @ApiProperty({
    description: 'Document _id',
    example: '61e57d30c748d8f18de310b2',
  })
  @IsMongoId()
  _id: string;
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
  extends IntersectionType(TimestampsDto, IdResponseDto)
  implements IBacicDocumentDto {}

export class ResultResponseDto implements IApiResult {
  @ApiProperty({
    description: 'Result attribute indicating all went fine',
    example: true,
    required: true,
  })
  @IsBoolean()
  result: true;
}
