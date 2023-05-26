import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FakeDocument, FakeSymbol, IFake } from './model.fake';
import { AbstractService } from '../abstract.service';

export class AbstractServiceFake extends AbstractService<IFake, FakeDocument> {
  constructor(
    @InjectModel(FakeSymbol)
    protected readonly model: Model<FakeDocument>,
  ) {
    super(AbstractServiceFake.name, model);
  }
}
