import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { DeleteResult, UpdateResult } from 'mongodb';

import { AbstractServiceFake } from './__fixtures__/abstract.service.fake';

import {
  FakeDocument,
  FakeSymbol,
  IFake,
  ModelFake,
} from './__fixtures__/model.fake';

const mockFakeDocument: IFake = {
  description: 'mock-description',
  name: 'mock-name',
};

const mockFilter: FilterQuery<FakeDocument> = { _id: 'mock-id' };
const mockProjection: ProjectionType<FakeDocument> = { name: true };
const mockOptions: QueryOptions<FakeDocument> = { lean: true };

describe('AbstractService', () => {
  let service: AbstractServiceFake;
  let model: Model<FakeDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbstractServiceFake,
        { provide: getModelToken(FakeSymbol), useValue: ModelFake },
      ],
    }).compile();

    service = module.get<AbstractServiceFake>(AbstractServiceFake);
    model = module.get<Model<FakeDocument>>(getModelToken(FakeSymbol));
  });

  describe('create', () => {
    let modelCreateSpy: jest.SpyInstance;

    beforeEach(() => {
      modelCreateSpy = jest.spyOn(model, 'create');
    });

    it('should create a document', async () => {
      modelCreateSpy.mockResolvedValueOnce(mockFakeDocument);

      const document = await service.create(mockFakeDocument);

      expect(document).toEqual(mockFakeDocument);
      expect(modelCreateSpy).toHaveBeenCalledWith(mockFakeDocument);
    });

    it('should throw if an error occurs', async () => {
      modelCreateSpy.mockRejectedValueOnce(new Error());

      await expect(service.create(mockFakeDocument)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(modelCreateSpy).toHaveBeenCalledWith(mockFakeDocument);
    });
  });

  describe('deleteOne', () => {
    let modelDeleteOneSpy: jest.SpyInstance;

    beforeEach(() => {
      modelDeleteOneSpy = jest.spyOn(model, 'deleteOne');
    });

    it('should delete one document', async () => {
      const mockDeleteResult = { deletedCount: 1 } as DeleteResult;

      modelDeleteOneSpy.mockResolvedValueOnce(mockDeleteResult);

      const deleteResult = await service.deleteOne(mockFilter);

      expect(deleteResult).toEqual(mockDeleteResult);
      expect(modelDeleteOneSpy).toHaveBeenCalledWith(mockFilter);
    });

    it('should throw if an error occurs', async () => {
      modelDeleteOneSpy.mockRejectedValueOnce(new Error());

      await expect(service.deleteOne(mockFilter)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(modelDeleteOneSpy).toHaveBeenCalledWith(mockFilter);
    });

    it('should throw if no document is found to be deleted', async () => {
      const mockDeleteResult = { deletedCount: 0 } as DeleteResult;

      modelDeleteOneSpy.mockResolvedValueOnce(mockDeleteResult);

      await expect(service.deleteOne(mockFilter)).rejects.toThrow(
        NotFoundException,
      );
      expect(modelDeleteOneSpy).toHaveBeenCalledWith(mockFilter);
    });
  });

  describe('deleteMany', () => {
    let modelDeleteManySpy: jest.SpyInstance;

    beforeEach(() => {
      modelDeleteManySpy = jest.spyOn(model, 'deleteMany');
    });

    it('should delete documents', async () => {
      const mockDeleteResult = { deletedCount: 2 } as DeleteResult;

      modelDeleteManySpy.mockResolvedValueOnce(mockDeleteResult);

      const deleteResult = await service.deleteMany(mockFilter);

      expect(deleteResult).toEqual(mockDeleteResult);
      expect(modelDeleteManySpy).toHaveBeenCalledWith(mockFilter);
    });

    it('should throw if an error occurs', async () => {
      modelDeleteManySpy.mockRejectedValueOnce(new Error());

      await expect(service.deleteMany(mockFilter)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(modelDeleteManySpy).toHaveBeenCalledWith(mockFilter);
    });
  });

  describe('find', () => {
    let modelFindSpy: jest.SpyInstance;

    beforeEach(() => {
      modelFindSpy = jest.spyOn(model, 'find');
    });

    it('should return the documents found', async () => {
      const documents: IFake[] = [mockFakeDocument];

      modelFindSpy.mockResolvedValueOnce(documents);

      const documentsFound = await service.find(
        mockFilter,
        mockProjection,
        mockOptions,
      );

      expect(documentsFound).toEqual(documents);

      expect(modelFindSpy).toHaveBeenCalledWith(
        mockFilter,
        mockProjection,
        mockOptions,
      );
    });

    it('should throw if an error occurs', async () => {
      modelFindSpy.mockRejectedValueOnce(new Error());

      await expect(
        service.find(mockFilter, mockProjection, mockOptions),
      ).rejects.toThrow(InternalServerErrorException);

      expect(modelFindSpy).toHaveBeenCalledWith(
        mockFilter,
        mockProjection,
        mockOptions,
      );
    });
  });

  describe('findOne', () => {
    let modelFindOneSpy: jest.SpyInstance;

    beforeEach(() => {
      modelFindOneSpy = jest.spyOn(model, 'findOne');
    });

    it('should return the document found', async () => {
      modelFindOneSpy.mockResolvedValueOnce(mockFakeDocument);

      const documentFound = await service.findOne(
        mockFilter,
        mockProjection,
        mockOptions,
      );

      expect(documentFound).toEqual(mockFakeDocument);

      expect(modelFindOneSpy).toHaveBeenCalledWith(
        mockFilter,
        mockProjection,
        mockOptions,
      );
    });

    it('should throw if an error occurs', async () => {
      modelFindOneSpy.mockRejectedValueOnce(new Error());

      await expect(
        service.findOne(mockFilter, mockProjection, mockOptions),
      ).rejects.toThrow(InternalServerErrorException);

      expect(modelFindOneSpy).toHaveBeenCalledWith(
        mockFilter,
        mockProjection,
        mockOptions,
      );
    });

    it('should throw if no document is found', async () => {
      modelFindOneSpy.mockResolvedValueOnce(null);

      await expect(
        service.findOne(mockFilter, mockProjection, mockOptions),
      ).rejects.toThrow(NotFoundException);

      expect(modelFindOneSpy).toHaveBeenCalledWith(
        mockFilter,
        mockProjection,
        mockOptions,
      );
    });
  });

  describe('updateOne', () => {
    const mockId = 'mock-id';

    const mockUpdateQuery: UpdateQuery<FakeDocument> = {
      $set: mockFakeDocument,
    };

    let modelUpdateOneSpy: jest.SpyInstance;

    beforeEach(() => {
      modelUpdateOneSpy = jest.spyOn(model, 'updateOne');
    });

    it('should update one document', async () => {
      const mockUpdateResult = { modifiedCount: 1 } as UpdateResult;
      modelUpdateOneSpy.mockResolvedValueOnce(mockUpdateResult);

      const updateResult = await service.updateOne(
        { _id: mockId },
        mockUpdateQuery,
      );

      expect(updateResult).toEqual(mockUpdateResult);

      expect(modelUpdateOneSpy).toHaveBeenCalledWith(
        { _id: mockId },
        {
          ...mockUpdateQuery,
          $inc: { __v: 1 },
        },
        {
          runValidators: true,
        },
      );
    });

    it('should throw if no document is found to be updated', async () => {
      const mockUpdateResult = { modifiedCount: 0 } as UpdateResult;
      modelUpdateOneSpy.mockResolvedValueOnce(mockUpdateResult);

      await expect(
        service.updateOne({ _id: mockId }, mockUpdateQuery),
      ).rejects.toThrow(NotFoundException);

      expect(modelUpdateOneSpy).toHaveBeenCalledWith(
        { _id: mockId },
        {
          ...mockUpdateQuery,
          $inc: { __v: 1 },
        },
        {
          runValidators: true,
        },
      );
    });

    it('should throw if an error occurs', async () => {
      modelUpdateOneSpy.mockRejectedValueOnce(new Error());

      await expect(
        service.updateOne({ _id: mockId }, mockUpdateQuery),
      ).rejects.toThrow(InternalServerErrorException);

      expect(modelUpdateOneSpy).toHaveBeenCalledWith(
        { _id: mockId },
        {
          ...mockUpdateQuery,
          $inc: { __v: 1 },
        },
        {
          runValidators: true,
        },
      );
    });
  });
});
