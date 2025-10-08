import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserClientGateway } from '../../../../src/core/domain/ports/UserClientGateway';
import { UpdateUserClientUseCase } from '../../../../src/application/userClient/useCase/Update';
import { UserClient } from '../../../../src/core/domain/userClient/entity/UserClient';
import { InvalidCpfException } from '../../../../src/shared/exceptions/InvalidCpfException';

class MockedInvalidPasswordException extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'InvalidPasswordException';
  }
}

describe('UpdateUserClientUseCase', () => {
  let useCase: UpdateUserClientUseCase;
  let mockUserClientGateway: jest.Mocked<UserClientGateway>;
  let mockExistingUser: jest.Mocked<UserClient>;

  const USER_ID = 'mock-user-id';
  const OTHER_USER_ID = 'other-user-id';

  const rightMock = (value: any) => ({ isLeft: () => false, value }) as any;

  const leftMock = (error: any) =>
    ({ isLeft: () => true, value: error }) as any;

  beforeEach(() => {
    mockUserClientGateway = {
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn().mockResolvedValue({}),
      create: jest.fn(),
      listAll: jest.fn(),
    } as any;

    mockExistingUser = {
      id: USER_ID,
      fullNameMock: 'Old Name',
      cpfMock: { toValue: '11111111111' },
      emailMock: { toValue: 'old@email.com' },
      identity: { id: USER_ID },

      changeFullName: jest.fn(() => rightMock(mockExistingUser)),
      changeCpf: jest.fn(() => rightMock(mockExistingUser)),
      changeEmail: jest.fn(() => rightMock(mockExistingUser)),
      changePassword: jest.fn(() => rightMock(mockExistingUser)),

      get fullName() {
        return 'Old Name';
      },
      get cpf() {
        return { toValue: '11111111111' } as any;
      },
      get email() {
        return { toValue: 'old@email.com' } as any;
      },
    } as any;

    useCase = new UpdateUserClientUseCase(mockUserClientGateway);

    jest.clearAllMocks();
    mockUserClientGateway.findById.mockResolvedValue(mockExistingUser);
    mockUserClientGateway.findByCpf.mockResolvedValue(null);
    mockUserClientGateway.findByEmail.mockResolvedValue(null);
  });

  // --- CENÁRIOS DE SUCESSO ---

  it('should successfully update all fields and save the entity', async () => {
    const updateData = {
      id: USER_ID,
      fullName: 'New Name',
      cpf: '22222222222',
      email: 'new@email.com',
      password: 'new_secure_password',
    };

    // MOCKS: Ajusta o mock para simular que os VOs estão sendo criados
    mockExistingUser.changeFullName.mockReturnValue(
      rightMock(mockExistingUser),
    );

    const result = await useCase.execute(USER_ID, updateData);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(mockExistingUser);

    expect(mockExistingUser.changeFullName).toHaveBeenCalledWith(
      updateData.fullName,
    );
    expect(mockExistingUser.changePassword).toHaveBeenCalledWith(
      updateData.password,
    );
    expect(mockUserClientGateway.save).toHaveBeenCalledTimes(1);
  });

  // --- CENÁRIOS DE FALHA DE DOMÍNIO ---

  it('should return InvalidPasswordException if domain validation fails for password', async () => {
    const updateData = { id: USER_ID, password: '123' };
    const errorInstance = new MockedInvalidPasswordException(
      'Password is too weak',
    );

    // Mock para simular falha: retorna left com a instância da exceção
    mockExistingUser.changePassword.mockReturnValue(leftMock(errorInstance));

    const result = await useCase.execute(USER_ID, updateData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(errorInstance);
    expect(mockUserClientGateway.save).not.toHaveBeenCalled();
  });

  it('should return InvalidCpfException if domain validation fails for CPF', async () => {
    const updateData = { id: USER_ID, cpf: 'invalid-cpf' };

    const errorInstance = new InvalidCpfException('CPF format invalid');
    // Mock para simular falha no método de domínio
    mockExistingUser.changeCpf.mockReturnValue(leftMock(errorInstance));

    const result = await useCase.execute(USER_ID, updateData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(errorInstance);
    expect(mockUserClientGateway.save).not.toHaveBeenCalled();
  });

  // --- CENÁRIOS DE FALHA DE VALIDAÇÃO (UNICIDADE) ---

  it('should return BadRequestException if Email already exists for another user', async () => {
    const updateData = { id: USER_ID, email: 'taken@email.com' };

    const otherUserMock = { identity: { id: OTHER_USER_ID } } as any;
    mockUserClientGateway.findByEmail.mockResolvedValue(otherUserMock);

    const result = await useCase.execute(USER_ID, updateData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect(mockExistingUser.changeEmail).not.toHaveBeenCalled(); // Deve falhar na validação, não no domínio
    expect(mockUserClientGateway.save).not.toHaveBeenCalled();
  });

  it('should handle updates where CPF is provided but unchanged (should pass)', async () => {
    const updateData = { id: USER_ID, cpf: mockExistingUser.cpf.toValue };

    const result = await useCase.execute(USER_ID, updateData);

    expect(result.isRight()).toBe(true);
    expect(mockUserClientGateway.findByCpf).not.toHaveBeenCalled(); // Não deve consultar o banco
    expect(mockExistingUser.changeCpf).not.toHaveBeenCalled(); // Não deve chamar o changeCpf
    expect(mockUserClientGateway.save).toHaveBeenCalledTimes(1);
  });
});
