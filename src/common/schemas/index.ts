import { Prop } from '@nestjs/mongoose';

import { IColoristId } from '../interfaces';
import { isMongoIdPropValidator } from '../constants';

export abstract class ColoristIdSchema implements IColoristId {
  @Prop({
    required: true,
    type: String,
    validate: isMongoIdPropValidator,
  })
  coloristId: string;
}
