import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';

import {
  ATTRIBUTE_EMAIL_LENGTH,
  ATTRIBUTE_USERNAME_LENGTH,
  ApiPropertyDto,
  ApiPropertyEmail,
  ApiPropertyLastName,
  ApiPropertyMongoId,
  ApiPropertyName,
  BasicDocumentDto,
} from '../../../common';

import {
  IColoristDto,
  IColoristSignInDto,
  ICreateColoristDto,
  ICreateColoristResponseDto,
} from '../interfaces';

import { COLORIST_HAIR_SALON_NAME_LENGTH } from '../constants';
import { Length } from 'class-validator';
import { IClientDto } from '../../client/interfaces';
import { ClientDto } from '../../client/dtos';
import { Client } from '../../client/schemas';
import { ApiPropertyColoristPassword } from '../decorators/colorist.decorator';

export class CreateColoristDto implements ICreateColoristDto {
  @ApiPropertyEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'hair salon name attribute',
    example: 'The Color Lab',
    maxLength: COLORIST_HAIR_SALON_NAME_LENGTH.MAX,
    minLength: COLORIST_HAIR_SALON_NAME_LENGTH.MIN,
    type: String,
  })
  @Length(
    COLORIST_HAIR_SALON_NAME_LENGTH.MIN,
    COLORIST_HAIR_SALON_NAME_LENGTH.MAX,
  )
  hairSalonName?: string;

  @ApiPropertyLastName()
  lastName: string;

  @ApiPropertyName()
  name: string;

  @ApiPropertyColoristPassword()
  password: string;

  @ApiProperty({
    description: 'colorist username attribute',
    example: 'CarlaColor',
    maxLength: ATTRIBUTE_USERNAME_LENGTH.MAX,
    minLength: ATTRIBUTE_USERNAME_LENGTH.MIN,
    type: String,
  })
  @Length(ATTRIBUTE_USERNAME_LENGTH.MIN, ATTRIBUTE_USERNAME_LENGTH.MAX)
  username: string;
}

export class UpdateColoristDto
  extends PartialType(CreateColoristDto)
  implements Partial<ICreateColoristDto> {}

export class ColoristDto
  extends IntersectionType(CreateColoristDto, BasicDocumentDto)
  implements IColoristDto
{
  @ApiPropertyDto({ dto: ClientDto, isArray: true })
  clients: IClientDto[];
}

export class CreateColoristResponseDto
  extends IntersectionType(CreateColoristDto, BasicDocumentDto)
  implements ICreateColoristResponseDto
{
  @ApiPropertyMongoId({ isArray: true, referenceName: Client.name })
  clients: string[];
}

export class ColoristSignInDto implements IColoristSignInDto {
  @ApiProperty({
    description: 'Value to find the colorist',
    examples: ['CarlaColor', 'carla@gmail.com'],
    maxLength: ATTRIBUTE_EMAIL_LENGTH.MAX,
    minLength: ATTRIBUTE_EMAIL_LENGTH.MIN,
  })
  @Length(ATTRIBUTE_EMAIL_LENGTH.MIN, ATTRIBUTE_EMAIL_LENGTH.MAX)
  emailOrUsername: string;

  @ApiPropertyColoristPassword()
  password: string;
}
