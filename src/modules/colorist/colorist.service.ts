import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { pbkdf2Sync } from 'crypto';
import { UpdateResult } from 'mongodb';

import { AbstractService } from '../../common';
import {
  IChangePassword,
  ICreateColorist,
  ICreateColoristResponseDto,
} from './interfaces';
import { Colorist, ColoristDocument } from './schemas';
import { ClientService } from '../client/client.service';
import { SheetService } from '../sheet/sheet.service';
import { BadCredentialsException } from '../auth/errors';

@Injectable()
export class ColoristService extends AbstractService<
  ICreateColorist,
  ColoristDocument
> {
  constructor(
    @InjectModel(Colorist.name)
    protected model: Model<ColoristDocument>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ClientService))
    private readonly clientService: ClientService,
    @Inject(forwardRef(() => SheetService))
    private readonly sheetService: SheetService,
  ) {
    super(ColoristService.name, model);
  }

  /**
   * Checks if the password provided on the input is the correct one for
   * the colorist password on the database.
   *
   * If it's not correct, it throws.
   *
   * @param {string} inputPassword
   * @param {string} coloristPassword Colorist encrypted password in database
   * @throws {BadCredentialsException}
   */
  assertPassword(inputPassword: string, coloristPassword: string): void {
    const encryptedInputPassword = this.encryptPassword(inputPassword);

    if (coloristPassword !== encryptedInputPassword) {
      throw new BadCredentialsException();
    }
  }

  /**
   * @async
   * @param {IChangePassword} options
   * @returns {Promise<UpdateResult>}
   */
  async changePassword({
    coloristId,
    newPassword,
    oldPassword,
  }: IChangePassword): Promise<UpdateResult> {
    const { password: currentPassword } = await this.findOne(
      { _id: coloristId },
      { password: true },
    );

    this.assertPassword(oldPassword, currentPassword);

    const newEncryptedPassword = this.encryptPassword(newPassword);

    return this.updateOne(
      { _id: coloristId },
      { $set: { password: newEncryptedPassword } },
    );
  }

  /**
   * Creates a new colorist with the password encrypted.
   *
   * @async
   * @param {ICreateColorist} coloristData Colorist attributes
   * @returns {Promise<ICreateColoristResponseDto>} Colorist data without the password
   */
  async createColorist(
    coloristData: ICreateColorist,
  ): Promise<ICreateColoristResponseDto> {
    coloristData.password = this.encryptPassword(coloristData.password);
    const createdColorist = await this.create(coloristData);
    const createdColoristObject = createdColorist.toObject();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...coloristToReturn } = createdColoristObject;

    return coloristToReturn;
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

  /**
   * Deletes a Colorist and all its related data.
   *
   * @async
   * @param {string} _id Colorist._id
   * @returns {Promise<void>}
   */
  async deleteColorist(_id: string): Promise<void> {
    const session = await this.model.startSession();
    session.startTransaction();

    try {
      await this.deleteOne({ _id }, session);
      await this.clientService.deleteMany({ coloristId: _id }, session);
      await this.sheetService.deleteMany({ coloristId: _id }, session);

      await session.commitTransaction();
    } catch (error) {
      this.logger.error('An error occurred while deleting Colorist', {
        _id,
        error,
      });

      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
