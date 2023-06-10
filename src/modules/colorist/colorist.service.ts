import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractService } from '../../common';
import { ICreateColorist } from './interfaces';
import { Colorist, ColoristDocument } from './schemas';

@Injectable()
export class ColoristService extends AbstractService<
  ICreateColorist,
  ColoristDocument
> {
  constructor(
    @InjectModel(Colorist.name)
    protected model: Model<ColoristDocument>,
  ) {
    super(ColoristService.name, model);
  }
}
