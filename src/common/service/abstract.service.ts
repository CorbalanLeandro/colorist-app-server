import { DeleteResult, UpdateResult } from 'mongodb';

import {
  AnyKeys,
  ClientSession,
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export abstract class AbstractService<
  CreateInterface,
  DocumentType extends Document,
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
   * Creates a document and updates the Parent document to have this new document as child
   * on the given attribute.
   *
   * @async
   * @param {CreateInterface} createData Data to create the child document
   * @param {T} parentService Service to make the update with
   * @param {string} parentId The parent's id which we are going to update
   * @param {keyof D} attributeNameOnParent The parent's attribute where we will add the new child's id
   * @returns {Promise<DocumentType>} The created document
   */
  async createAndUpdateParent<
    K,
    D extends Document,
    T extends AbstractService<K, D>,
  >(
    createData: CreateInterface,
    parentService: T,
    parentId: string,
    attributeNameOnParent: keyof D,
  ): Promise<DocumentType> {
    await this.assertParentExist<K, D, T>(parentId, parentService);

    const session = await this.model.startSession();
    session.startTransaction();

    try {
      const newDocument = await this.create(createData, session);
      const { _id: newDocumentId } = newDocument;

      await parentService.updateOne(
        { _id: parentId },
        { $push: { [attributeNameOnParent]: newDocumentId } as AnyKeys<D> },
        session,
      );

      await session.commitTransaction();
      return newDocument;
    } catch (error) {
      this.logger.error('Could not create the new child Document.', {
        createData,
        error,
      });

      await session.abortTransaction();
      throw new InternalServerErrorException(
        'Something went wrong when creating the document.',
      );
    } finally {
      await session.endSession();
    }
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @returns {Promise<DeleteResult>}
   */
  async deleteOne(filter: FilterQuery<DocumentType>): Promise<DeleteResult> {
    let deleteResult: DeleteResult;

    const logCtx = {
      filter,
      modelName: this.model.modelName,
    };

    try {
      deleteResult = await this.model.deleteOne(filter);
    } catch (error) {
      this.logger.error('An error occurred while deleting a mongo document', {
        ...logCtx,
        error,
      });

      throw new InternalServerErrorException();
    }

    if (deleteResult.deletedCount === 0) {
      this.handleDocumentNotFound('deleteOne', logCtx);
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
      this.logger.error(
        'An error occurred while deleting the mongo documents',
        {
          error,
          filter,
          modelName: this.model.modelName,
        },
      );

      throw new InternalServerErrorException();
    }
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @returns {Promise<boolean>} True if exists.
   */
  async exists(filter: FilterQuery<DocumentType>): Promise<boolean> {
    return (await this.model.exists(filter)) != null;
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @param {ProjectionType<DocumentType>} projection
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
      this.logger.error('An error occurred while finding the mongo documents', {
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
    filter: FilterQuery<DocumentType>,
    projection?: ProjectionType<DocumentType>,
    options?: QueryOptions<DocumentType>,
  ): Promise<DocumentType> {
    let document: DocumentType | null;

    const logCtx = {
      filter,
      modelName: this.model.modelName,
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

      throw new InternalServerErrorException();
    }

    if (!document) {
      this.handleDocumentNotFound('findOne', logCtx);
    }

    return document;
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @param {UpdateQuery<DocumentType>} updateQuery
   * @returns {Promise<UpdateResult>}
   */
  async updateMany(
    filter: FilterQuery<DocumentType>,
    updateQuery: UpdateQuery<DocumentType>,
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
        },
      );
    } catch (error) {
      this.logger.error('An error occurred while updating a mongo documents', {
        error,
        filter,
        modelName: this.model.modelName,
        updateQuery,
      });

      throw new InternalServerErrorException();
    }
  }

  /**
   * @async
   * @param {FilterQuery<DocumentType>} filter
   * @param {UpdateQuery<DocumentType>} updateQuery
   * @param {ClientSession} session Mongodb session
   * @returns {Promise<UpdateResult>}
   */
  async updateOne(
    filter: FilterQuery<DocumentType>,
    updateQuery: UpdateQuery<DocumentType>,
    session?: ClientSession,
  ): Promise<UpdateResult> {
    let updateResult: UpdateResult;

    const logCtx = {
      filter,
      modelName: this.model.modelName,
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

      throw new InternalServerErrorException();
    }

    if (updateResult.modifiedCount === 0) {
      this.handleDocumentNotFound('updateOne', logCtx);
    }

    return updateResult;
  }

  /**
   * If parent does not exists, throws a bad request exception
   *
   * @async
   * @param {string} parentId
   * @param {T} parentService
   */
  protected async assertParentExist<
    K,
    D extends Document,
    T extends AbstractService<K, D>,
  >(parentId: string, parentService: T): Promise<void> {
    let parentExists: boolean;

    try {
      parentExists = await parentService.exists({ _id: parentId });
    } catch (error) {
      this.logger.error('Could not assert parent exists.', {
        error,
        modelName: this.model.modelName,
        parentId,
      });

      throw new InternalServerErrorException('Could not assert parent exists.');
    }

    if (!parentExists) {
      throw new BadRequestException('Parent does not exists.');
    }
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
