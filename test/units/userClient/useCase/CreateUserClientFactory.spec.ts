import { UserClientFactory } from '../../../../src/application/userClient/useCase/factory/CreateUserClient.factory';
import { InvalidEmailException } from '../../../../src/shared/exceptions/InvalidEmailException';
import { InvalidCpfException } from '../../../../src/shared/exceptions/InvalidCpfException';
import { InvalidBalanceException } from '../../../../src/shared/exceptions/InvalidBalanceException';


jest.mock('../../../../src/core/domain/userClient/objectValues/Email', () => ({
  Email: { create: jest.fn() },
}));

jest.mock('../../../../src/core/domain/userClient/objectValues/CPF', () => ({
  CPF: { create: jest.fn() },
}));

jest.mock(
  '../../../../src/core/domain/userClient/objectValues/Balance',
  () => ({
    Balance: { createFromReal: jest.fn() },
  }),
);

jest.mock('../../../../src/core/domain/userClient/entity/UserClient', () => ({
  UserClient: { create: jest.fn() },
}));

import { Email } from '../../../../src/core/domain/userClient/objectValues/Email';
import { CPF } from '../../../../src/core/domain/userClient/objectValues/CPF';
import { Balance } from '../../../../src/core/domain/userClient/objectValues/Balance';
import { UserClient } from '../../../../src/core/domain/userClient/entity/UserClient';

describe('UserClientFactory', () => {
  const mockValidData = {
    fullName: 'Test User',
    cpf: '12345678901',
    email: 'test@email.com',
    password: 'secure_password',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um UserClient com dados válidos', () => {
    (Email.create as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: {},
    });
    (CPF.create as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: {},
    });
    (Balance.createFromReal as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: {},
    });
    (UserClient.create as jest.Mock).mockReturnValue({});

    const result = UserClientFactory.create(mockValidData);

    expect(result.isRight()).toBe(true);
    expect(Email.create).toHaveBeenCalledWith(mockValidData.email);
    expect(CPF.create).toHaveBeenCalledWith(mockValidData.cpf);
    expect(Balance.createFromReal).toHaveBeenCalledWith(0);
    expect(UserClient.create).toHaveBeenCalledTimes(1);
  });

  it('deve retornar InvalidEmailException quando o email for inválido', () => {
    (Email.create as jest.Mock).mockReturnValue({ isLeft: () => true });

    const result = UserClientFactory.create(mockValidData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailException);
    expect(CPF.create).not.toHaveBeenCalled();
    expect(Balance.createFromReal).not.toHaveBeenCalled();
    expect(UserClient.create).not.toHaveBeenCalled();
  });

  it('deve retornar InvalidCpfException quando o CPF for inválido', () => {
    (Email.create as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: {},
    });
    (CPF.create as jest.Mock).mockReturnValue({ isLeft: () => true });

    const result = UserClientFactory.create(mockValidData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCpfException);
    expect(Balance.createFromReal).not.toHaveBeenCalled();
    expect(UserClient.create).not.toHaveBeenCalled();
  });

  it('deve retornar InvalidBalanceException quando o saldo inicial for inválido', () => {
    (Email.create as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: {},
    });
    (CPF.create as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: {},
    });
    (Balance.createFromReal as jest.Mock).mockReturnValue({
      isLeft: () => true,
    });

    const result = UserClientFactory.create(mockValidData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidBalanceException);
    expect(UserClient.create).not.toHaveBeenCalled();
  });
});
