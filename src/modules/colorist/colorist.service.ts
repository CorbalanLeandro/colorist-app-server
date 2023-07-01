import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { pbkdf2Sync } from 'crypto';

import { AbstractService } from '../../common';
import { ICreateColorist, ICreateColoristResponseDto } from './interfaces';
import { Colorist, ColoristDocument } from './schemas';
import { ClientService } from '../client/client.service';
import { SheetService } from '../sheet/sheet.service';
import { HairServiceService } from '../hair-service/hair-service.service';

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
    @Inject(forwardRef(() => HairServiceService))
    private readonly hairServiceService: HairServiceService,
    @Inject(forwardRef(() => SheetService))
    private readonly sheetService: SheetService,
  ) {
    super(ColoristService.name, model);
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

  /**
   * Deletes a Colorist and all its related data.
   *
   * @async
   * @param {string} _id Colorist._id
   * @returns {Promise<void>}
   */
  async deleteColorist(_id: string): Promise<void> {
    await this.deleteOne({ _id });

    try {
      await Promise.all([
        this.clientService.deleteMany({ coloristId: _id }),
        this.hairServiceService.deleteMany({ coloristId: _id }),
        this.sheetService.deleteMany({ coloristId: _id }),
      ]);
    } catch (error) {
      this.logger.error(
        'An error ocurred while deleting Colorist related data',
        { _id, error },
      );
    }
  }
}
