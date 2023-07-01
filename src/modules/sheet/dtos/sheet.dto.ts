import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

import {
  ApiPropertyDto,
  BasicDocumentDto,
  BasicQueryDto,
  ColoristIdDto,
} from '../../../common';

import {
  ICreateSheetDto,
  ICreateSheetResponseDto,
  IFindSheetsQueryDto,
  ISheetDto,
} from '../interfaces';

import { IHairServiceDto } from '../../hair-service/interfaces';
import { HairServiceDto } from '../../hair-service/dtos';
import { IsSheetDate } from '../decorators';

export class CreateSheetDto implements ICreateSheetDto {
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

/**
 * Only Date available to update on a Sheet.
 * TODO: Sheet's client change.
 */

export class UpdateSheetDto
  extends PickType(CreateSheetDto, ['date'])
  implements Pick<ICreateSheetDto, 'date'> {}

export class SheetDto
  extends IntersectionType(CreateSheetDto, BasicDocumentDto, ColoristIdDto)
  implements ISheetDto
{
  @ApiPropertyDto({ dto: HairServiceDto, isArray: true })
  hairServices: IHairServiceDto[];
}

export class CreateSheetResponseDto
  extends IntersectionType(CreateSheetDto, BasicDocumentDto, ColoristIdDto)
  implements ICreateSheetResponseDto {}

export class FindSheetsQueryDto
  extends BasicQueryDto
  implements IFindSheetsQueryDto {}
