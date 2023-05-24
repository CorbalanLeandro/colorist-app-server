import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

import { ApiPropertyColoristId, ApiPropertyDto } from '../../../common';

import {
  ICreateHairService,
  IHairService,
  IHairServiceIngredient,
} from '../interfaces';

import { HairServiceIngredientsDto } from './hair-service-ingredient.dto';
import { HAIR_SERVICE_NAME_LENGHT } from '../constants';

export class HairServiceDto implements IHairService {
  @ApiPropertyColoristId()
  coloristId: string;

  @ApiPropertyDto({ dto: HairServiceIngredientsDto })
  ingredients: IHairServiceIngredient[];

  @ApiProperty({
    description: 'Hair service name.',
    example: 'Balayage',
    maxLength: HAIR_SERVICE_NAME_LENGHT.MAX,
    minLength: HAIR_SERVICE_NAME_LENGHT.MIN,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Hair service observations.',
    example: 'The hair is damage, use less oxidizing next time.',
    maxLength: HAIR_SERVICE_NAME_LENGHT.MAX,
    minLength: HAIR_SERVICE_NAME_LENGHT.MIN,
  })
  observations?: string;
}

export class CreateHairServiceDto
  extends OmitType(HairServiceDto, ['coloristId'])
  implements ICreateHairService {}

export class UpdateHairServiceDto
  extends PartialType(OmitType(HairServiceDto, ['coloristId']))
  implements Partial<ICreateHairService> {}
