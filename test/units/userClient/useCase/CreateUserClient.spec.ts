import { BadRequestException } from '@nestjs/common';
import { CreateUserClientUseCase } from '../../../../src/application/userClient/useCase/Create';
import { UserClientFactory } from '../../../../src/application/userClient/useCase/factory/CreateUserClient.factory';
import { HashPasswordGateway } from '../../../../src/core/domain/ports/HashPasswordGateway';
import { UserClientGateway } from '../../../../src/core/domain/ports/UserClientGateway';
import { UserClient } from '../../../../src/core/domain/userClient/entity/UserClient';
import { InvalidCpfException } from '../../../../src/shared/exceptions/InvalidCpfException';
import { InvalidEmailException } from '../../../../src/shared/exceptions/InvalidEmailException';
import { left, right } from '../../../../src/shared/utils/either';

jest.mock(
  '../../../../src/application/userClient/useCase/factory/CreateUserClient.factory',
);

describe('CreateUserClientUseCase', () => {
  let useCase: CreateUserClientUseCase;
  let userClientGateway: jest.Mocked<UserClientGateway>;
  let hashPasswordGateway: jest.Mocked<HashPasswordGateway>;
  let userClient: jest.Mocked<UserClient>;

  beforeEach(() => {
    userClientGateway = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
    } as any;

    hashPasswordGateway = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as any;

    userClient = {
      changePassword: jest.fn(),
    } as any;

    useCase = new CreateUserClientUseCase(
      userClientGateway,
      hashPasswordGateway,
    );
    jest.clearAllMocks();
  });

  const request = {
    fullName: 'John Doe',
    cpf: '123.456.789-00',
    email: 'john.doe@example.com',
    password: 'password123',
  };

  it('should create a new user client', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue(null);
    (UserClientFactory.create as jest.Mock).mockReturnValue(right(userClient));
    hashPasswordGateway.hash.mockResolvedValue('hashed_password');
    (userClient.changePassword as jest.Mock).mockReturnValue(right(undefined));

    const result = await useCase.execute(request);

    expect(result.isRight()).toBe(true);
    expect(userClientGateway.findByEmail).toHaveBeenCalledWith(request.email);
    expect(userClientGateway.findByCpf).toHaveBeenCalledWith(request.cpf);
    expect(UserClientFactory.create).toHaveBeenCalledWith(request);
    expect(hashPasswordGateway.hash).toHaveBeenCalledWith(userClient.password);
    expect(userClient.changePassword).toHaveBeenCalledWith('hashed_password');
    expect(userClientGateway.create).toHaveBeenCalledWith(userClient);
    expect(result.value).toEqual(userClient);
  });

  it('should return an error if email already exists', async () => {
    userClientGateway.findByEmail.mockResolvedValue({} as UserClient);

    const result = await useCase.execute(request);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Email already exists.',
    );
  });

  it('should return an error if CPF already exists', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue({} as UserClient);

    const result = await useCase.execute(request);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'CPF already exists.',
    );
  });

  it('should return an error if user creation fails', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue(null);
    const error = new InvalidEmailException();
    (UserClientFactory.create as jest.Mock).mockReturnValue(left(error));

    const result = await useCase.execute(request);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(error);
  });

  it('should return an error if password hashing fails', async () => {
    userClientGateway.findByEmail.mockResolvedValue(null);
    userClientGateway.findByCpf.mockResolvedValue(null);
    (UserClientFactory.create as jest.Mock).mockReturnValue(right(userClient));
    hashPasswordGateway.hash.mockResolvedValue('hashed_password');
    const error = new InvalidCpfException();
    (userClient.changePassword as jest.Mock).mockReturnValue(left(error));

    const result = await useCase.execute(request);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(error);
  });
});
