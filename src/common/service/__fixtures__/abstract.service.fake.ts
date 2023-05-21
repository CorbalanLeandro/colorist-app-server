import { Model } from 'mongoose';
import { AbstractService } from '../abstract.service';
import { FakeDocument, FakeSymbol, IFake } from './model.fake';
import { InjectModel } from '@nestjs/mongoose';

export class AbstractServiceFake extends AbstractService<IFake, FakeDocument> {
  constructor(
    @InjectModel(FakeSymbol)
    protected readonly model: Model<FakeDocument>,
  ) {
    super(AbstractServiceFake.name, model);
  }
}
