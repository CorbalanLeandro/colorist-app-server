import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ColoristService } from '../colorist/colorist.service';
import { IAuthColorist, ISignInResponse } from './interfaces';
import { IColoristSignInDto } from '../colorist/interfaces';
import { BadCredentialsException } from './errors';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly coloristService: ColoristService,
  ) {}

  /**
   * @async
   * @param {IColoristSignInDto} signInData
   * @returns {Promise<ISignInResponse>}
   */
  async signIn(signInData: IColoristSignInDto): Promise<ISignInResponse> {
    const { emailOrUsername, password } = signInData;

    try {
      const { _id: coloristId, password: coloristPassword } =
        await this.findColorist(emailOrUsername);

      this.coloristService.assertPassword(password, coloristPassword);

      return {
        access_token: await this.jwtService.signAsync({ sub: coloristId }),
      };
    } catch (error) {
      this.logger.error('Could not sign in', {
        error,
        user: emailOrUsername,
      });

      if (
        error instanceof NotFoundException ||
        error instanceof BadCredentialsException
      ) {
        throw new BadCredentialsException();
      }

      throw new InternalServerErrorException();
    }
  }

  /**
   * Finds a colorist by email or username
   *
   * @async
   * @param {string} emailOrUsername To use as filter.
   * @returns {IAuthColorist} Colorist auth required data
   */
  private async findColorist(emailOrUsername: string): Promise<IAuthColorist> {
    return this.coloristService.findOne(
      {
        $or: [
          {
            username: emailOrUsername,
          },
          {
            email: emailOrUsername,
          },
        ],
      },
      {
        password: true,
      },
    );
  }
}
