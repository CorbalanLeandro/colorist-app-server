import { DeleteResult, UpdateResult } from 'mongodb';

import {
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export abstract class AbstractService<T, DocumentType extends Document & T> {
  protected constructor(name: string, model: Model<DocumentType>) {
    this.model = model;
    this.name = name;
    this.logger = new Logger(name);
  }

  protected readonly model: Model<DocumentType>;
  protected readonly name: string;
  protected readonly logger: Logger;

  /**
   * @async
   * @param {T} data
   * @returns {Promise<DocumentType>}
   */
  async create(data: T): Promise<DocumentType> {
    try {
      return await this.model.create<T>(data);
    } catch (error) {
      this.logger.error('An error ocurred while creating a mongo document', {
        data,
        error,
        modelName: this.model.modelName,
      });

      throw new InternalServerErrorException();
    }
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @returns {Promise<DeleteResult>}
   */
  async deleteOne(filter: FilterQuery<DocumentType>): Promise<DeleteResult> {
    let deleteResult: DeleteResult;

    try {
      deleteResult = await this.model.deleteOne(filter);
    } catch (error) {
      this.logger.error('An error ocurred while deleting a mongo document', {
        error,
        filter,
        modelName: this.model.modelName,
      });

      throw new InternalServerErrorException();
    }

    if (deleteResult.deletedCount === 0) {
      throw new NotFoundException();
    }

    return deleteResult;
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @returns {Promise<DeleteResult>}
   */
  async deleteMany(filter: FilterQuery<DocumentType>): Promise<DeleteResult> {
    try {
      return await this.model.deleteMany(filter);
    } catch (error) {
      this.logger.error('An error ocurred while deleting the mongo documents', {
        error,
        filter,
        modelName: this.model.modelName,
      });

      throw new InternalServerErrorException();
    }
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @param {QueryOptions<DocumentType>} options
   * @returns {Promise<DocumentType[]>}
   */
  async find(
    filter: FilterQuery<DocumentType> = {},
    projection?: ProjectionType<DocumentType>,
    options?: QueryOptions<DocumentType>,
  ): Promise<DocumentType[]> {
    try {
      return await this.model.find(filter, projection, options);
    } catch (error) {
      this.logger.error('An error ocurred while finding the mongo documents', {
        error,
        filter,
        modelName: this.model.modelName,
        options,
        projection,
      });

      throw new InternalServerErrorException();
    }
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @param {ProjectionType<DocumentType>} projection
   * @param {QueryOptions<DocumentType>} options
   * @returns {Promise<DocumentType>}
   */
  async findOne(
    filter: FilterQuery<DocumentType> = {},
    projection?: ProjectionType<DocumentType>,
    options?: QueryOptions<DocumentType>,
  ): Promise<DocumentType> {
    let document: DocumentType | null;

    try {
      document = await this.model.findOne(filter, projection, options);
    } catch (error) {
      this.logger.error('An error ocurred while finding a mongo document', {
        error,
        filter,
        modelName: this.model.modelName,
        options,
        projection,
      });

      throw new InternalServerErrorException();
    }

    if (!document) {
      throw new NotFoundException();
    }

    return document;
  }

  /**
   * @async
   * @param {string} _id
   * @param {UpdateQuery<DocumentType>} updateQuery
   * @returns {Promise<UpdateResult>}
   */
  async updateOne(
    _id: string,
    updateQuery: UpdateQuery<DocumentType>,
  ): Promise<UpdateResult> {
    let updateResult: UpdateResult;

    try {
      updateResult = await this.model.updateOne(
        { _id },
        {
          ...updateQuery,
          $inc: { __v: 1 },
        },
        {
          runValidators: true,
        },
      );
    } catch (error) {
      this.logger.error('An error ocurred while updating a mongo document', {
        error,
        modelName: this.model.modelName,
        updateQuery,
      });

      throw new InternalServerErrorException();
    }

    if (updateResult.modifiedCount === 0) {
      throw new NotFoundException();
    }

    return updateResult;
  }
}
