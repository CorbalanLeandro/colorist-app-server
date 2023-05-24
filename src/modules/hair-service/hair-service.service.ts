import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService } from '../../common';
import { ICreateHairService } from './interfaces';
import { HairService, HairServiceDocument } from './schemas';

@Injectable()
export class HairServiceService extends AbstractService<
  ICreateHairService,
  HairServiceDocument
> {
  constructor(
    @InjectModel(HairService.name)
    protected model: Model<HairServiceDocument>,
  ) {
    super(HairServiceService.name, model);
  }
}
