import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
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
  HAIR_SERVICE_NAME_LENGHT,
  HAIR_SERVICE_OBSERVATIONS_LENGHT,
} from '../constants';

export class CreateHairServiceDto implements ICreateHairServiceDto {
  @ApiPropertyDto({ dto: HairServiceIngredientsDto, isArray: true })
  ingredients: IHairServiceIngredient[];

  @ApiProperty({
    description: 'Hair service name.',
    example: 'Balayage',
    maxLength: HAIR_SERVICE_NAME_LENGHT.MAX,
    minLength: HAIR_SERVICE_NAME_LENGHT.MIN,
  })
  @Length(HAIR_SERVICE_NAME_LENGHT.MIN, HAIR_SERVICE_NAME_LENGHT.MAX)
  name: string;

  @ApiPropertyOptional({
    description: 'Hair service observations.',
    example: 'The hair is damage, use less oxidizing next time.',
    maxLength: HAIR_SERVICE_OBSERVATIONS_LENGHT.MAX,
    minLength: HAIR_SERVICE_OBSERVATIONS_LENGHT.MIN,
  })
  @IsOptional()
  @Length(
    HAIR_SERVICE_OBSERVATIONS_LENGHT.MIN,
    HAIR_SERVICE_OBSERVATIONS_LENGHT.MAX,
  )
  observations?: string;

  @ApiProperty({
    description: `Sheet's _id to which this hair service belongs`,
    example: '6193e45824ec040624af509d',
  })
  @IsMongoId()
  sheet: string;
}

export class UpdateHairServiceDto
  extends PartialType(CreateHairServiceDto)
  implements Partial<ICreateHairServiceDto> {}

export class HairServiceDto
  extends IntersectionType(
    CreateHairServiceDto,
    BasicDocumentDto,
    ColoristIdDto,
  )
  implements IHairServiceDto {}
