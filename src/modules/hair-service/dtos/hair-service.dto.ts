import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

import { IsMongoId, IsOptional, Length } from 'class-validator';

import {
  ApiPropertyDto,
  BasicDocumentDto,
  ColoristIdDto,
} from '../../../common';

import {
  ICreateHairServiceDto,
  IHairServiceDto,
  IHairServiceIngredient,
} from '../interfaces';

import { HairServiceIngredientsDto } from './hair-service-ingredient.dto';

import {
  HAIR_SERVICE_NAME_LENGTH,
  HAIR_SERVICE_OBSERVATIONS_LENGTH,
} from '../constants';

export class CreateHairServiceDto implements ICreateHairServiceDto {
  @ApiProperty({
    description: `Client's _id to which this hair service belongs`,
    example: '6193e45824ec040624af509d',
  })
  @IsMongoId()
  clientId: string;

  @ApiPropertyDto({ dto: HairServiceIngredientsDto, isArray: true })
  ingredients: IHairServiceIngredient[];

  @ApiProperty({
    description: 'Hair service name.',
    example: 'Balayage',
    maxLength: HAIR_SERVICE_NAME_LENGTH.MAX,
    minLength: HAIR_SERVICE_NAME_LENGTH.MIN,
  })
  @Length(HAIR_SERVICE_NAME_LENGTH.MIN, HAIR_SERVICE_NAME_LENGTH.MAX)
  name: string;

  @ApiPropertyOptional({
    description: 'Hair service observations.',
    example: 'The hair is damage, use less oxidizing next time.',
    maxLength: HAIR_SERVICE_OBSERVATIONS_LENGTH.MAX,
    minLength: HAIR_SERVICE_OBSERVATIONS_LENGTH.MIN,
  })
  @IsOptional()
  @Length(
    HAIR_SERVICE_OBSERVATIONS_LENGTH.MIN,
    HAIR_SERVICE_OBSERVATIONS_LENGTH.MAX,
  )
  observations?: string;

  @ApiProperty({
    description: `Sheet's _id to which this hair service belongs`,
    example: '6193e45824ec040624af509d',
  })
  @IsMongoId()
  sheetId: string;
}

export class UpdateHairServiceDto
  extends PartialType(OmitType(CreateHairServiceDto, ['clientId', 'sheetId']))
  implements Partial<Omit<ICreateHairServiceDto, 'clientId' | 'sheetId'>> {}

export class HairServiceDto
  extends IntersectionType(
    CreateHairServiceDto,
    BasicDocumentDto,
    ColoristIdDto,
  )
  implements IHairServiceDto {}
