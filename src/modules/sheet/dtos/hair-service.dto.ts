import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

import { ApiPropertyDto } from '../../../common';
import { IHairService, IHairServiceIngredient } from '../interfaces';
import { HairServiceIngredientsDto } from './hair-service-ingredient.dto';

import {
  HAIR_SERVICE_NAME_LENGTH,
  HAIR_SERVICE_OBSERVATIONS_LENGTH,
} from '../constants';

export class HairServiceDto implements IHairService {
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
    nullable: true,
  })
  @IsOptional()
  @Length(
    HAIR_SERVICE_OBSERVATIONS_LENGTH.MIN,
    HAIR_SERVICE_OBSERVATIONS_LENGTH.MAX,
  )
  observations?: string;
}
