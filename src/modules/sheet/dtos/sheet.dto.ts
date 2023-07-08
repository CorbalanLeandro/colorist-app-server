import {
  ApiProperty,
  IntersectionType,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

import {
  ApiPropertyDto,
  BasicDocumentDto,
  BasicQueryDto,
  ColoristIdDto,
} from '../../../common';

import {
  IChangeClientDto,
  ICreateHairServiceInSheet,
  ICreateSheetDto,
  ICreateSheetResponseDto,
  IFindSheetsQueryDto,
  ISheetDto,
} from '../interfaces';

import { IHairServiceDto } from '../../hair-service/interfaces';
import { CreateHairServiceDto, HairServiceDto } from '../../hair-service/dtos';
import { IsSheetDate } from '../decorators';

class CreateHairServiceInSheetDto
  extends OmitType(CreateHairServiceDto, ['clientId', 'sheetId'])
  implements ICreateHairServiceInSheet {}

export class CreateSheetDto implements ICreateSheetDto {
  @ApiPropertyDto({
    dto: CreateHairServiceInSheetDto,
    isArray: true,
  })
  hairServices: ICreateHairServiceInSheet[];

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
