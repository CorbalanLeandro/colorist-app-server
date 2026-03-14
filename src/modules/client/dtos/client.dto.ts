import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';

import {
  ATTRIBUTE_LAST_NAME_LENGTH,
  ATTRIBUTE_NAME_LENGTH,
  ApiPropertyEmail,
  ApiPropertyLastName,
  ApiPropertyName,
  ApiPropertyPhoneNumber,
  BasicDocumentDto,
  BasicQueryDto,
  ColoristIdDto,
} from '../../../common';

import {
  ICreateClientDto,
  IClientDto,
  IFindClientsQueryDto,
} from '../interfaces';

import { IsOptional, MaxLength } from 'class-validator';

export class CreateClientDto implements ICreateClientDto {
  @ApiPropertyEmail({ required: false })
  email?: string;

  @ApiPropertyLastName()
  lastName: string;

  @ApiPropertyName()
  name: string;

  @ApiPropertyPhoneNumber({ required: false })
  phoneNumber?: string;
}

export class UpdateClientDto
  extends PartialType(CreateClientDto)
  implements Partial<ICreateClientDto> {}

export class ClientDto
  extends IntersectionType(CreateClientDto, BasicDocumentDto, ColoristIdDto)
  implements IClientDto {}

export class FindClientsQueryDto
  extends BasicQueryDto
  implements IFindClientsQueryDto
{
  @ApiPropertyOptional({
    description:
      'name attribute to filter. "jo" will return "Jonathan", "John", etc.',
    example: 'Jo',
  })
  @IsOptional()
  @MaxLength(ATTRIBUTE_NAME_LENGTH.MAX)
  name?: string;

  @ApiPropertyOptional({
    description:
      'last name attribute to filter. "do" will return "Doe", "Donaric", etc.',
    example: 'Do',
  })
  @IsOptional()
  @MaxLength(ATTRIBUTE_LAST_NAME_LENGTH.MAX)
  lastName?: string;
}
