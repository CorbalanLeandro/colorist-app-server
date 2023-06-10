import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from './decorators';
import { ColoristSignInDto } from '../colorist/dtos';
import { SignInResponse } from './dtos';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description:
      'Verify the email or username and return the JWT if the password is correct.',
    summary: 'Initiates the session for a colorist.',
  })
  @ApiOkResponse({
    description: 'The access token.',
    type: SignInResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInData: ColoristSignInDto): Promise<SignInResponse> {
    return this.authService.signIn(signInData);
  }
}
