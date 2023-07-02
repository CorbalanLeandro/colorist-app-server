import { BadRequestException } from '@nestjs/common';

export class BadCredentialsException extends BadRequestException {
  constructor() {
    super('Credentials are invalid.');
  }
}
