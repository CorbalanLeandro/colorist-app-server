import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { ColoristService } from '../colorist/colorist.service';
import { Colorist } from '../colorist/schemas';
import { ISignInResponse } from './interfaces';
import { IColoristSignInDto } from '../colorist/interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly coloristService: ColoristService,
  ) {}

  async signIn(signInData: IColoristSignInDto): Promise<ISignInResponse> {
    const { emailOrUsername, password } = signInData;

    try {
      const { _id: coloristId } = await this.coloristService.findOne(
        {
          $or: [
            {
              username: {
                $options: 'i',
                $regex: `^${emailOrUsername}$`,
              },
            },
            {
              email: {
                $options: 'i',
                $regex: `^${emailOrUsername}$`,
              },
            },
          ],
          password: Colorist.encryptPassword(password),
        },
        {
          _id: true,
        },
      );

      return {
        access_token: await this.jwtService.signAsync({ sub: coloristId }),
      };
    } catch (error) {
      this.logger.error('Could not sign in', {
        error,
        user: signInData.emailOrUsername,
      });

      if (error instanceof NotFoundException) {
        throw new BadRequestException('Credentials are invalid.');
      }

      throw error;
    }
  }
}
