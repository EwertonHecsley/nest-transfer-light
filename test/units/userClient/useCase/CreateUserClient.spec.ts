import { BadRequestException } from '@nestjs/common';
import { CreateUserClientUseCase } from '../../../../src/application/userClient/useCase/Create';
import { UserClientFactory } from '../../../../src/application/userClient/useCase/factory/CreateUserClient.factory';
import { UserClientGateway } from '../../../../src/core/domain/ports/UserClientGateway';
import { UserClient } from '../../../../src/core/domain/userClient/entity/UserClient';
import { InvalidBalanceException } from '../../../../src/shared/exceptions/InvalidBalanceException';
import { InvalidCpfException } from '../../../../src/shared/exceptions/InvalidCpfException';
import { InvalidEmailException } from '../../../../src/shared/exceptions/InvalidEmailException';
import { left, right } from '../../../../src/shared/utils/either';

// Mock do Factory
jest.mock(
  '../../../../src/application/userClient/useCase/factory/CreateUserClient.factory',
  () => ({
    UserClientFactory: {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
    },
  }),
);

describe('CreateUserClientUseCase', () => {
  let useCase: CreateUserClientUseCase;
  let userClientGateway: jest.Mocked<UserClientGateway>;

  const mockRequest = {
    fullName: 'Test User',
    cpf: '12345678901',
    email: 'test@email.com',
    password: 'strong_password',
  };

  const mockUser = { id: '1', ...mockRequest } as unknown as UserClient;

  beforeEach(() => {
    // Criando mocks para o gateway
    userClientGateway = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      save: jest.fn(),
    } as any;

    useCase = new CreateUserClientUseCase(userClientGateway);

    jest.clearAllMocks();
  });

  it('deve criar um usuário com dados válidos', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue(null);
    (UserClientFactory.create as jest.Mock).mockReturnValue(right(mockUser));

    const result = await useCase.execute(mockRequest);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(mockUser);
    expect(userClientGateway.findByEmail).toHaveBeenCalledWith(
      mockRequest.email,
    );
    expect(userClientGateway.findByCpf).toHaveBeenCalledWith(mockRequest.cpf);
    expect(UserClientFactory.create).toHaveBeenCalledWith(mockRequest);
  });

  it('deve retornar erro se email já existir', async () => {
    userClientGateway.findByEmail.mockResolvedValue(mockUser);

    const result = await useCase.execute(mockRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect(userClientGateway.findByCpf).not.toHaveBeenCalled();
    expect(UserClientFactory.create).not.toHaveBeenCalled();
  });

  it('deve retornar erro se CPF já existir', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue(mockUser);

    const result = await useCase.execute(mockRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect(UserClientFactory.create).not.toHaveBeenCalled();
  });

  it('deve retornar erro se o Factory falhar com email inválido', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue(null);
    (UserClientFactory.create as jest.Mock).mockReturnValue(
      left(new InvalidEmailException()),
    );

    const result = await useCase.execute(mockRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailException);
  });

  it('deve retornar erro se o Factory falhar com CPF inválido', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue(null);
    (UserClientFactory.create as jest.Mock).mockReturnValue(
      left(new InvalidCpfException()),
    );

    const result = await useCase.execute(mockRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCpfException);
  });

  it('deve retornar erro se o Factory falhar com saldo inválido', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue(null);
    (UserClientFactory.create as jest.Mock).mockReturnValue(
      left(new InvalidBalanceException()),
    );

    const result = await useCase.execute(mockRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidBalanceException);
  });
});
