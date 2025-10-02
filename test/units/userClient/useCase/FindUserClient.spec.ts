import { FindUserClientUseCase } from '../../../../src/application/userClient/useCase/Find';
import { UserClientGateway } from '../../../../src/core/domain/ports/UserClientGateway';
import { UserClient } from '../../../../src/core/domain/userClient/entity/UserClient';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('FindUserClientUseCase', () => {
  let useCase: FindUserClientUseCase;
  let mockUserClientGateway: jest.Mocked<UserClientGateway>;

  beforeEach(() => {
    mockUserClientGateway = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
    };
    useCase = new FindUserClientUseCase(mockUserClientGateway);
  });

  it('should return BadRequestException if ID is invalid or empty', async () => {
    const result = await useCase.execute({ id: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect(mockUserClientGateway.findById).not.toHaveBeenCalled();
  });

  it('should return NotFoundException if user is not found', async () => {
    mockUserClientGateway.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'non-existent-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect(mockUserClientGateway.findById).toHaveBeenCalledWith(
      'non-existent-id',
    );
  });

  it('should return the user client if found', async () => {
    const mockUser = {
      id: 'valid-id',
      fullName: 'Test User',
    } as unknown as UserClient;
    mockUserClientGateway.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute({ id: 'valid-id' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(mockUser);
    expect(mockUserClientGateway.findById).toHaveBeenCalledWith('valid-id');
  });
});
