import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { ColoristService } from '../colorist/colorist.service';
import { IAuthColorist, ISignInResponse } from './interfaces';
import { IColoristSignInDto } from '../colorist/interfaces';

class BadCredentialsError extends BadRequestException {
  constructor() {
    super('Credentials are invalid.');
  }
}

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

      if (!this.isCorrectPassword(password, coloristPassword)) {
        throw new BadCredentialsError();
      }

      return {
        access_token: await this.jwtService.signAsync({ sub: coloristId }),
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadCredentialsError
      ) {
        throw new BadCredentialsError();
      }

      this.logger.error('Could not sign in', {
        error,
        user: signInData.emailOrUsername,
      });

      throw error;
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
      },
      {
        _id: true,
        password: true,
      },
    );
  }

  /**
   * Checks if the password provided on the input is the correct one for
   * the colorist password on the database
   *
   * @param {strint} inputPassword
   * @param {string} coloristPassword Colorist password in database
   * @returns {boolean} A boolean indicating if the input password is correct.
   */
  private isCorrectPassword(
    inputPassword: string,
    coloristPassword: string,
  ): boolean {
    const encryptInputPassword =
      this.coloristService.encryptPassword(inputPassword);

    return coloristPassword === encryptInputPassword;
  }
}
