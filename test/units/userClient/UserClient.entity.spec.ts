import { UserClient } from '@/core/domain/userClient/entity/UserClient';
import { Balance } from '@/core/domain/userClient/objectValues/Balance';
import { CPF } from '@/core/domain/userClient/objectValues/CPF';
import { Email } from '@/core/domain/userClient/objectValues/Email';
import { InvalidBalanceException } from '@/shared/exceptions/InvalidBalanceException';

jest.mock('../objectValues/Balance', () => {
  return {
    Balance: jest.fn().mockImplementation((value) => {
      return {
        valueAsReal: value / 100,
        add: jest.fn((amount) => {
          const newValue = value + Math.round(amount * 100);
          return {
            isLeft: () => false,
            value: new (jest.requireActual('../objectValues/Balance').Balance)(
              newValue,
            ),
          };
        }),
        subtract: jest.fn((amount) => {
          const newValue = value - Math.round(amount * 100);
          if (newValue < 0) {
            return {
              isLeft: () => true,
              value: new InvalidBalanceException('Insufficient balance.'),
            };
          }
          return {
            isLeft: () => false,
            value: new (jest.requireActual('../objectValues/Balance').Balance)(
              newValue,
            ),
          };
        }),
      };
    }),
    createFromReal: jest.fn((amount) => {
      if (amount < 0) {
        return {
          isLeft: () => true,
          value: new InvalidBalanceException('Balance cannot be negative.'),
        };
      }
      return {
        isLeft: () => false,
        value: new (jest.requireActual('../objectValues/Balance').Balance)(
          Math.round(amount * 100),
        ),
      };
    }),
  };
});
jest.mock('../objectValues/CPF', () => {
  return {
    CPF: jest.fn().mockImplementation((value) => ({ toValue: value })),
    create: jest.fn((cpf) => {
      const cleaned = cpf.replace(/\D/g, '');
      if (cleaned.length !== 11) {
        return { isLeft: () => true, value: new Error('Invalid CPF format') };
      }
      return {
        isLeft: () => false,
        value: new (jest.requireActual('../objectValues/CPF').CPF)(cleaned),
      };
    }),
  };
});
jest.mock('../objectValues/Email', () => {
  return {
    Email: jest.fn().mockImplementation((value) => ({ toValue: value })),
    create: jest.fn((email) => {
      if (!email) {
        return { isLeft: () => true, value: 'EMPTY_EMAIL' };
      }
      return {
        isLeft: () => false,
        value: new (jest.requireActual('../objectValues/Email').Email)(email),
      };
    }),
  };
});

describe('UserClient Entity', () => {
  let mockBalance: Balance;
  let mockCpf: CPF;
  let mockEmail: Email;

  beforeEach(() => {
    mockBalance = (Balance.createFromReal(100) as any).value;
    mockCpf = (CPF.create('12345678901') as any).value;
    mockEmail = (Email.create('test@email.com') as any).value;
  });

  it('should create a UserClient instance with correct attributes', () => {
    const user = UserClient.create({
      fullName: 'John Doe',
      email: mockEmail,
      password: 'hashed_password',
      cpf: mockCpf,
      balance: mockBalance,
      createdAt: new Date(),
    });
    expect(user).toBeInstanceOf(UserClient);
    expect(user.fullName).toBe('John Doe');
    expect(user.email).toBe(mockEmail);
    expect(user.cpf).toBe(mockCpf);
    expect(user.balance).toBe(mockBalance);
  });

  it('should add funds to the user balance', () => {
    const user = UserClient.create({
      fullName: 'John Doe',
      email: mockEmail,
      password: 'hashed_password',
      cpf: mockCpf,
      balance: mockBalance,
      createdAt: new Date(),
    });

    const initialBalance = user.balance.valueAsReal;
    const addAmount = 50;

    const result = user.addFunds(addAmount);

    expect(result.isRight()).toBe(true);
    expect((result.value as UserClient).balance.valueAsReal).toBe(
      initialBalance + addAmount,
    );
  });

  it('should return an error if addFunds fails', () => {
    const user = UserClient.create({
      fullName: 'John Doe',
      email: mockEmail,
      password: 'hashed_password',
      cpf: mockCpf,
      balance: mockBalance,
      createdAt: new Date(),
    });

    (user.balance.add as jest.Mock).mockReturnValue({
      isLeft: () => true,
      value: new InvalidBalanceException('Mocked error'),
    });

    const result = user.addFunds(10);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidBalanceException);
  });

  it('should transfer funds between two users successfully', () => {
    const sender = UserClient.create({
      fullName: 'Sender User',
      email: (Email.create('sender@email.com') as any).value,
      password: 'password',
      cpf: (CPF.create('12345678901') as any).value,
      balance: (Balance.createFromReal(200) as any).value,
      createdAt: new Date(),
    });

    const destination = UserClient.create({
      fullName: 'Destination User',
      email: (Email.create('dest@email.com') as any).value,
      password: 'password',
      cpf: (CPF.create('98765432109') as any).value,
      balance: (Balance.createFromReal(50) as any).value,
      createdAt: new Date(),
    });

    const amount = 50;
    const result = sender.makeTransfer(amount, destination);

    expect(result.isRight()).toBe(true);
    expect(sender.balance.valueAsReal).toBe(150);
    expect(destination.balance.valueAsReal).toBe(100);
  });

  it('should not transfer funds if sender has insufficient balance', () => {
    const sender = UserClient.create({
      fullName: 'Sender User',
      email: (Email.create('sender@email.com') as any).value,
      password: 'password',
      cpf: (CPF.create('12345678901') as any).value,
      balance: (Balance.createFromReal(50) as any).value,
      createdAt: new Date(),
    });

    const destination = UserClient.create({
      fullName: 'Destination User',
      email: (Email.create('dest@email.com') as any).value,
      password: 'password',
      cpf: (CPF.create('98765432109') as any).value,
      balance: (Balance.createFromReal(50) as any).value,
      createdAt: new Date(),
    });

    const amount = 100;
    const result = sender.makeTransfer(amount, destination);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidBalanceException);
    expect(sender.balance.valueAsReal).toBe(50);
    expect(destination.balance.valueAsReal).toBe(50);
  });

  it('should rollback sender balance if destination fails to receive funds', () => {
    const sender = UserClient.create({
      fullName: 'Sender User',
      email: (Email.create('sender@email.com') as any).value,
      password: 'password',
      cpf: (CPF.create('12345678901') as any).value,
      balance: (Balance.createFromReal(200) as any).value,
      createdAt: new Date(),
    });

    const destination = UserClient.create({
      fullName: 'Destination User',
      email: (Email.create('dest@email.com') as any).value,
      password: 'password',
      cpf: (CPF.create('98765432109') as any).value,
      balance: (Balance.createFromReal(50) as any).value,
      createdAt: new Date(),
    });

    (destination.balance.add as jest.Mock).mockReturnValue({
      isLeft: () => true,
      value: new InvalidBalanceException('Destination cannot receive funds.'),
    });

    const amount = 50;
    const result = sender.makeTransfer(amount, destination);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidBalanceException);
    expect(sender.balance.valueAsReal).toBe(200);
    expect(destination.balance.valueAsReal).toBe(50);
  });

  it('should get correct attributes via getters', () => {
    const user = UserClient.create({
      fullName: 'Jane Doe',
      email: mockEmail,
      password: 'hashed_password',
      cpf: mockCpf,
      balance: mockBalance,
      createdAt: new Date(),
    });

    expect(user.fullName).toBe('Jane Doe');
    expect(user.email).toBe(mockEmail);
    expect(user.password).toBe('hashed_password');
    expect(user.cpf).toBe(mockCpf);
    expect(user.balance).toBe(mockBalance);
    expect(user.createdAt).toBeInstanceOf(Date);
  });
});
