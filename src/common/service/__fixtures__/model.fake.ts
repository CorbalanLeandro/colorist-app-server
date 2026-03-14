/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Document } from 'mongoose';

import { NotImplementedError } from '../../errors';

export interface IFake {
  description: string;
  name: string;
}

export const FakeSymbol = 'FakeSymbol';

export type FakeDocument = IFake & Document;

/**
 * Fake class to use on every model.
 */
export class ModelFake {
  modelName = 'FakeDocument';

  async create() {
    throw new NotImplementedError('create');
  }

  async deleteOne() {
    throw new NotImplementedError('deleteOne');
  }

  async deleteMany() {
    throw new NotImplementedError('deleteMany');
  }

  async find() {
    throw new NotImplementedError('find');
  }

  async findOne() {
    throw new NotImplementedError('findOne');
  }

  async updateOne() {
    throw new NotImplementedError('updateOne');
  }
}
