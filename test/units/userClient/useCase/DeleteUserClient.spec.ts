import { NotFoundException } from '@nestjs/common';
import { DeleteUserClientUseCase } from '../../../../src/application/userClient/useCase/Delete';
import { UserClientGateway } from '../../../../src/core/domain/ports/UserClientGateway';
import { UserClient } from '../../../../src/core/domain/userClient/entity/UserClient';

describe('DeleteUserClientUseCase', () => {
  let useCase: DeleteUserClientUseCase;
  let mockUserClientGateway: jest.Mocked<UserClientGateway>;

  beforeEach(() => {
    mockUserClientGateway = {
      findById: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      listAll: jest.fn(),
      save: jest.fn(),
    };
    useCase = new DeleteUserClientUseCase(mockUserClientGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete a user if the user exists', async () => {
    const userId = 'existing-id';
    const mockUser = { id: userId } as unknown as UserClient;

    mockUserClientGateway.findById.mockResolvedValue(mockUser);
    mockUserClientGateway.delete.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: userId });

    expect(mockUserClientGateway.findById).toHaveBeenCalledWith(userId);
    expect(mockUserClientGateway.delete).toHaveBeenCalledWith(userId);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
  });

  it('should return a NotFoundException if the user to be deleted does not exist', async () => {
    const userId = 'non-existent-id';
    mockUserClientGateway.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: userId });

    expect(mockUserClientGateway.findById).toHaveBeenCalledWith(userId);
    expect(mockUserClientGateway.delete).not.toHaveBeenCalled();
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
  });
});
