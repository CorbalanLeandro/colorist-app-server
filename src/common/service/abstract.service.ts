import { DeleteResult, UpdateResult } from 'mongodb';

import {
  ClientSession,
  Document,
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export abstract class AbstractService<
  CreateInterface,
  DocumentType extends Document<unknown>,
> {
  protected constructor(
    protected readonly name: string,
    protected readonly model: Model<DocumentType>,
  ) {
    this.model = model;
    this.name = name;
    this.logger = new Logger(name);
  }

  protected readonly logger: Logger;

  /**
   * @async
   * @param {CreateInterface} createData
   * @param {ClientSession} session Mongodb session
   * @returns {Promise<DocumentType>}
   */
  async create(
    createData: CreateInterface,
    session?: ClientSession,
  ): Promise<DocumentType> {
    try {
      const newDocument = new this.model<CreateInterface>(createData);
      return await newDocument.save({ session });
    } catch (error) {
      this.logger.error('An error occurred while creating a mongo document', {
        createData,
        error,
        modelName: this.model.modelName,
      });

      throw new InternalServerErrorException(
        `Could not create a ${this.model.modelName}`,
      );
    }
  }

  /**
   * @async
   * @param {QueryFilter<DocumentType>} filter
   * @param {ClientSession} session Mongodb session
   * @returns {Promise<DeleteResult>}
   */
  async deleteOne(
    filter: QueryFilter<DocumentType>,
    session?: ClientSession,
  ): Promise<DeleteResult> {
    let deleteResult: DeleteResult;

    const modelName = this.model.modelName;
    const logCtx = {
      filter,
      modelName,
    };

    try {
      deleteResult = await this.model.deleteOne(filter, { session });
    } catch (error) {
      this.logger.error('An error occurred while deleting a mongo document', {
        ...logCtx,
        error,
      });

      throw new InternalServerErrorException(
        `Could not delete the ${modelName} document`,
      );
    }

    if (deleteResult.deletedCount === 0) {
      this.handleDocumentNotFound('deleteOne', logCtx);
    }

    return deleteResult;
  }

  /**
   * @async
   * @param {QueryFilter<DocumentType>} filter
   * @param {ClientSession} session Mongodb session
   * @returns {Promise<DeleteResult>}
   */
  async deleteMany(
    filter: QueryFilter<DocumentType>,
    session?: ClientSession,
  ): Promise<DeleteResult> {
    try {
      return await this.model.deleteMany(filter, { session });
    } catch (error) {
      const modelName = this.model.modelName;
      this.logger.error(
        'An error occurred while deleting the mongo documents',
        {
          error,
          filter,
          modelName,
        },
      );

      throw new InternalServerErrorException(
        `Could not delete many ${modelName} documents`,
      );
    }
  }

  /**
   * @async
   * @param {QueryFilter<DocumentType>} filter
   * @returns {Promise<boolean>} True if exists.
   */
  async exists(filter: QueryFilter<DocumentType>): Promise<boolean> {
    return (await this.model.exists(filter)) != null;
  }

  /**
   * @async
   * @param {QueryFilter<DocumentType>} filter
   * @param {ProjectionType<DocumentType>} projection
   * @param {QueryOptions<DocumentType>} options
   * @returns {Promise<DocumentType[]>}
   */
  async find(
    filter: QueryFilter<DocumentType> = {},
    projection?: ProjectionType<DocumentType>,
    options?: QueryOptions<DocumentType>,
  ): Promise<DocumentType[]> {
    try {
      return await this.model.find(filter, projection, options);
    } catch (error) {
      const modelName = this.model.modelName;
      this.logger.error('An error occurred while finding the mongo documents', {
        error,
        filter,
        modelName,
        options,
        projection,
      });

      throw new InternalServerErrorException(
        `Could not find the ${this.model.modelName} documents`,
      );
    }
  }

  /**
   * @async
   * @param {QueryFilter<DocumentType>} filter
   * @param {ProjectionType<DocumentType>} projection
   * @param {QueryOptions<DocumentType>} options
   * @returns {Promise<DocumentType>}
   */
  async findOne(
    filter: QueryFilter<DocumentType>,
    projection?: ProjectionType<DocumentType>,
    options?: QueryOptions<DocumentType>,
  ): Promise<DocumentType> {
    let document: DocumentType | null;

    const modelName = this.model.modelName;
    const logCtx = {
      filter,
      modelName,
      options,
      projection,
    };

    try {
      document = await this.model.findOne(filter, projection, options);
    } catch (error) {
      this.logger.error('An error occurred while finding a mongo document', {
        ...logCtx,
        error,
      });

      throw new InternalServerErrorException(
        `Could not find ${modelName} document`,
      );
    }

    if (!document) {
      this.handleDocumentNotFound('findOne', logCtx);
    }

    return document;
  }

  /**
   * @async
   * @param {QueryFilter<DocumentType>} filter
   * @param {UpdateQuery<DocumentType>} updateQuery
   * @param {ClientSession} session Mongodb session
   * @returns {Promise<UpdateResult>}
   */
  async updateMany(
    filter: QueryFilter<DocumentType>,
    updateQuery: UpdateQuery<DocumentType>,
    session?: ClientSession,
  ): Promise<UpdateResult> {
    try {
      return await this.model.updateMany(
        filter,
        {
          ...updateQuery,
          $inc: { __v: 1 },
        },
        {
          runValidators: true,
          session,
        },
      );
    } catch (error) {
      const modelName = this.model.modelName;
      this.logger.error('An error occurred while updating a mongo documents', {
        error,
        filter,
        modelName,
        updateQuery,
      });

      throw new InternalServerErrorException(
        `Could not update many ${modelName} documents`,
      );
    }
  }

  /**
   * @async
   * @param {QueryFilter<DocumentType>} filter
   * @param {UpdateQuery<DocumentType>} updateQuery
   * @param {ClientSession} session Mongodb session
   * @returns {Promise<UpdateResult>}
   */
  async updateOne(
    filter: QueryFilter<DocumentType>,
    updateQuery: UpdateQuery<DocumentType>,
    session?: ClientSession,
  ): Promise<UpdateResult> {
    let updateResult: UpdateResult;

    const modelName = this.model.modelName;
    const logCtx = {
      filter,
      modelName,
      updateQuery,
    };

    try {
      updateResult = await this.model.updateOne(
        filter,
        {
          ...updateQuery,
          $inc: { __v: 1 },
        },
        {
          runValidators: true,
          session,
        },
      );
    } catch (error) {
      this.logger.error('An error occurred while updating a mongo document', {
        ...logCtx,
        error,
      });

      throw new InternalServerErrorException(
        `Could not update ${modelName} document`,
      );
    }

    if (updateResult.modifiedCount === 0) {
      this.handleDocumentNotFound('updateOne', logCtx);
    }

    return updateResult;
  }

  /**
   * Emits the log with the log context and throw a NotFoundException
   *
   * @param method method being invoked
   * @param logCtx object to log
   */
  private handleDocumentNotFound(
    method: string,
    logCtx: Record<string, any>,
  ): never {
    this.logger.error(`${method}: Document not found`, logCtx);
    throw new NotFoundException(`${this.model.modelName} was not found.`);
  }
}
