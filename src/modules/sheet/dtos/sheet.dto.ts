import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { ArrayMaxSize, IsMongoId } from 'class-validator';

import {
  ApiPropertyDto,
  BasicDocumentDto,
  BasicQueryDto,
  ColoristIdDto,
} from '../../../common';

import {
  IChangeClientDto,
  ICreateSheetDto,
  IFindSheetsQueryDto,
  IHairService,
  ISheet,
} from '../interfaces';

import { IsSheetDate } from '../decorators';
import { SHEET_MAX_HAIR_SERVICES } from '../constants';
import { HairServiceDto } from './hair-service.dto';

export class CreateSheetDto implements ICreateSheetDto {
  @ApiPropertyDto({
    dto: HairServiceDto,
    isArray: true,
  })
  @ArrayMaxSize(SHEET_MAX_HAIR_SERVICES)
  hairServices: IHairService[];

  @ApiProperty({
    description: `Client's _id to which this sheet belongs`,
    example: '6193e45824ec040624af509d',
  })
  @IsMongoId()
  clientId: string;

  @ApiProperty({
    description: 'date attribute, format dd/MM/yyyy',
    example: '29/05/2023',
  })
  @IsSheetDate()
  date: string;
}

export class UpdateSheetDto
  extends PartialType(CreateSheetDto)
  implements Partial<ICreateSheetDto> {}

export class SheetDto
  extends IntersectionType(CreateSheetDto, BasicDocumentDto, ColoristIdDto)
  implements ISheet {}

export class FindSheetsQueryDto
  extends BasicQueryDto
  implements IFindSheetsQueryDto {}

export class ChangeClientDto implements IChangeClientDto {
  @ApiProperty({
    description: 'Client to change the sheet to.',
    example: '64a0becfbf758de993d7fafd',
  })
  @IsMongoId()
  newClientId: string;

  @ApiProperty({
    description: 'Client that have the sheet at the moment.',
    example: '64a0becfbf758de993d7fafd',
  })
  @IsMongoId()
  oldClientId: string;
}
