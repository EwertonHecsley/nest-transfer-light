import { BadRequestException } from '@nestjs/common';
import { UserCommon } from '@/core/domain/users/common/entity/UserCommon';
import { UserCommonFactory } from '@/application/users/common/useCase/factory/CreateUserCommon.factory';
import { CreateUserCommonUseCase } from '@/application/users/common/useCase/Create';
import { UserCommonGateway } from '@/core/domain/users/common/gateway/UserCommonGateway';
import { EncryptionGateway } from '@/core/domain/users/common/gateway/EncryptonGateway';
import { right, left } from '@/shared/utils/either';
import { Identity } from '@/core/generics/Identity';

// Mocks para isolar o UseCase das dependências
jest.mock(
  '@/application/users/common/useCase/factory/CreateUserCommon.factory',
);
jest.mock('@/core/domain/users/common/gateway/UserCommonGateway');
jest.mock('@/core/domain/users/common/gateway/EncryptonGateway');
jest.mock('@/core/domain/users/common/entity/UserCommon');
jest.mock('@/core/generics/Identity');

describe('CreateUserCommonUseCase', () => {
  let useCase: CreateUserCommonUseCase;
  let userCommonRepository: jest.Mocked<UserCommonGateway>;
  let encryptionRepository: jest.Mocked<EncryptionGateway>;

  // Cria um objeto mock simples que simula a entidade UserCommon
  const mockUserCommon = {
    identity: new Identity(),
    fullName: 'Test User',
    cpf: { toValue: '123.456.789-00' },
    email: { toValue: 'test@example.com' },
    password: 'unhashedPassword',
    common: true,
    createdAt: new Date(),
    updatePassword: jest.fn(),
  };

  const mockDto = {
    fullName: 'Test User',
    cpf: '123.456.789-00',
    email: 'test@example.com',
    password: 'unhashedPassword',
    common: true,
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    userCommonRepository = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
    } as any;

    encryptionRepository = {
      hash: jest.fn(),
    } as any;

    useCase = new CreateUserCommonUseCase(
      userCommonRepository,
      encryptionRepository,
    );

    (UserCommonFactory.create as jest.Mock).mockReturnValue(
      right(mockUserCommon as unknown as UserCommon),
    );
  });

  it('should create a UserCommon entity successfully with a valid DTO', async () => {
    userCommonRepository.findByEmail.mockResolvedValue(null);
    userCommonRepository.findByCpf.mockResolvedValue(null);
    encryptionRepository.hash.mockResolvedValue('hashedPassword');
    userCommonRepository.create.mockResolvedValue(
      mockUserCommon as unknown as UserCommon,
    );

    const result = await useCase.execute(mockDto);

    expect(userCommonRepository.findByEmail).toHaveBeenCalledWith(
      mockDto.email,
    );
    expect(userCommonRepository.findByCpf).toHaveBeenCalledWith(mockDto.cpf);
    expect(UserCommonFactory.create).toHaveBeenCalledWith(mockDto);
    expect(encryptionRepository.hash).toHaveBeenCalledWith(mockDto.password);
    expect(mockUserCommon.updatePassword).toHaveBeenCalledWith(
      'hashedPassword',
    );
    expect(userCommonRepository.create).toHaveBeenCalledWith(mockUserCommon);
    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(mockUserCommon);
  });

  it('should return BadRequestException if email already exists', async () => {
    userCommonRepository.findByEmail.mockResolvedValue(
      mockUserCommon as unknown as UserCommon,
    );

    const result = await useCase.execute(mockDto);

    expect(userCommonRepository.findByEmail).toHaveBeenCalledWith(
      mockDto.email,
    );
    expect(userCommonRepository.findByCpf).not.toHaveBeenCalled();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Email is already.',
    );
  });

  it('should return BadRequestException if cpf already exists', async () => {
    userCommonRepository.findByEmail.mockResolvedValue(null);
    userCommonRepository.findByCpf.mockResolvedValue(
      mockUserCommon as unknown as UserCommon,
    );

    const result = await useCase.execute(mockDto);

    expect(userCommonRepository.findByEmail).toHaveBeenCalledWith(
      mockDto.email,
    );
    expect(userCommonRepository.findByCpf).toHaveBeenCalledWith(mockDto.cpf);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'CPF is alredy.',
    );
  });

  it('should return BadRequestException if UserCommonFactory returns an error', async () => {
    const factoryError = new BadRequestException('Invalid DTO');
    userCommonRepository.findByEmail.mockResolvedValue(null);
    userCommonRepository.findByCpf.mockResolvedValue(null);

    (UserCommonFactory.create as jest.Mock).mockReturnValue(left(factoryError));

    const result = await useCase.execute(mockDto);

    expect(userCommonRepository.findByEmail).toHaveBeenCalledWith(
      mockDto.email,
    );
    expect(userCommonRepository.findByCpf).toHaveBeenCalledWith(mockDto.cpf);
    expect(UserCommonFactory.create).toHaveBeenCalledWith(mockDto);
    expect(encryptionRepository.hash).not.toHaveBeenCalled();
    expect(userCommonRepository.create).not.toHaveBeenCalled();
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe('Invalid DTO');
  });
});
