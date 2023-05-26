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
  static async create() {
    throw new NotImplementedError('create');
  }

  static async deleteOne() {
    throw new NotImplementedError('deleteOne');
  }

  static async deleteMany() {
    throw new NotImplementedError('deleteMany');
  }

  static async find() {
    throw new NotImplementedError('find');
  }

  static async findOne() {
    throw new NotImplementedError('findOne');
  }

  static async updateOne() {
    throw new NotImplementedError('updateOne');
  }
}
