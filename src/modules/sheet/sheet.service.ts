import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AbstractService } from '../../common';
import { ICreateSheet } from './interfaces';
import { Sheet, SheetDocument } from './schemas';

@Injectable()
export class SheetService extends AbstractService<ICreateSheet, SheetDocument> {
  constructor(
    @InjectModel(Sheet.name)
    protected model: Model<SheetDocument>,
  ) {
    super(SheetService.name, model);
  }
}
