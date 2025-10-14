import { Test, TestingModule } from '@nestjs/testing';
import { ListAllUserClientUseCase } from '../../../../../../src/application/userClient/useCase/List';
import type { Response } from 'express';
import { ListAllUserClientController } from '../../../../../../src/infra/http/userClient/controllers/list.controller';

describe('ListAllUserClientController', () => {
  let controller: ListAllUserClientController;
  let listAllUserClientUseCase: ListAllUserClientUseCase;

  const mockListAllUserClientUseCase = {
    execute: jest.fn(),
  };

  const mockResponse = {
    json: jest.fn(),
    status: jest.fn(() => mockResponse),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListAllUserClientController],
      providers: [
        {
          provide: ListAllUserClientUseCase,
          useValue: mockListAllUserClientUseCase,
        },
      ],
    }).compile();

    controller = module.get<ListAllUserClientController>(
      ListAllUserClientController,
    );
    listAllUserClientUseCase = module.get<ListAllUserClientUseCase>(
      ListAllUserClientUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handler', () => {
    it('should call listAllUserClientUseCase with default pagination and return a list of user clients', async () => {
      const result = {
        data: [],
        total: 0,
        limit: 10,
        page: 1,
      };
      mockListAllUserClientUseCase.execute.mockResolvedValue(result);

      await controller.handler('1', '10', mockResponse);

      expect(listAllUserClientUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User clients list successfully',
        ...result,
      });
    });

    it('should call listAllUserClientUseCase with provided pagination and return a list of user clients', async () => {
      const result = {
        data: [],
        total: 0,
        limit: 5,
        page: 2,
      };
      mockListAllUserClientUseCase.execute.mockResolvedValue(result);

      await controller.handler('2', '5', mockResponse);

      expect(listAllUserClientUseCase.execute).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User clients list successfully',
        ...result,
      });
    });
  });
});
