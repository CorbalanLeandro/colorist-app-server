import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { pbkdf2Sync } from 'crypto';

import { AbstractService } from '../../common';
import { ICreateColorist, ICreateColoristResponseDto } from './interfaces';
import { Colorist, ColoristDocument } from './schemas';

@Injectable()
export class ColoristService extends AbstractService<
  ICreateColorist,
  ColoristDocument
> {
  constructor(
    @InjectModel(Colorist.name)
    protected model: Model<ColoristDocument>,
    private readonly configService: ConfigService,
  ) {
    super(ColoristService.name, model);
  }

  /**
   * Creates a new colorist with the password encrypted.
   *
   * @async
   * @param {ICreateColorist} data Colorist attributes
   * @returns {Promise<ICreateColoristResponseDto>} Colorist data without the password
   */
  async createColorist(
    data: ICreateColorist,
  ): Promise<ICreateColoristResponseDto> {
    data.password = this.encryptPassword(data.password);
    const createdColorist = await this.create(data);
    const createdColoristObject = createdColorist.toObject();

    delete createdColoristObject.password;

    return createdColoristObject as ICreateColoristResponseDto;
  }

  /**
   *
   * @param {string} password
   * @returns {string} Encrypted password
   */
  encryptPassword(password: string): string {
    return pbkdf2Sync(
      password,
      this.configService.getOrThrow('auth.passwordSalt'),
      1000,
      64,
      'sha512',
    ).toString('hex');
  }
}
