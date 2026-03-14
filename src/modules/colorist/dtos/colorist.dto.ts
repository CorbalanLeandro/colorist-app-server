import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

import { IsAlphanumeric, Length, IsOptional } from 'class-validator';

import {
  ATTRIBUTE_EMAIL_LENGTH,
  ATTRIBUTE_USERNAME_LENGTH,
  ApiPropertyEmail,
  ApiPropertyLastName,
  ApiPropertyName,
  BasicDocumentDto,
} from '../../../common';

import {
  IChangePasswordDto,
  IColoristDto,
  IColoristSignInDto,
  ICreateColoristDto,
  ICreateColoristResponseDto,
} from '../interfaces';

import { COLORIST_HAIR_SALON_NAME_LENGTH } from '../constants';
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
  @IsOptional()
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
  @IsAlphanumeric()
  username: string;
}

export class UpdateColoristDto
  extends PartialType(
    OmitType(CreateColoristDto, ['username', 'email', 'password']),
  )
  implements
    Partial<Omit<ICreateColoristDto, 'username' | 'email' | 'password'>> {}

export class ColoristDto
  extends IntersectionType(
    OmitType(CreateColoristDto, ['password']),
    BasicDocumentDto,
  )
  implements IColoristDto {}

export class CreateColoristResponseDto
  extends IntersectionType(ColoristDto, BasicDocumentDto)
  implements ICreateColoristResponseDto {}

export class ColoristSignInDto implements IColoristSignInDto {
  @ApiProperty({
    description: 'Value to find the colorist',
    example: 'carla@gmail.com',
    maxLength: ATTRIBUTE_EMAIL_LENGTH.MAX,
    minLength: ATTRIBUTE_EMAIL_LENGTH.MIN,
  })
  @Length(ATTRIBUTE_EMAIL_LENGTH.MIN, ATTRIBUTE_EMAIL_LENGTH.MAX)
  emailOrUsername: string;

  @ApiPropertyColoristPassword()
  password: string;
}

export class ChangePasswordDto implements IChangePasswordDto {
  @ApiPropertyColoristPassword()
  newPassword: string;

  @ApiPropertyColoristPassword()
  oldPassword: string;
}
