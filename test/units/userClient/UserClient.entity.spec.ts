import { UserClient } from '../../../src/core/domain/userClient/entity/UserClient';
import { Balance } from '../../../src/core/domain/userClient/objectValues/Balance';
import { CPF } from '../../../src/core/domain/userClient/objectValues/CPF';
import { Email } from '../../../src/core/domain/userClient/objectValues/Email';
import { InvalidBalanceException } from '../../../src/shared/exceptions/InvalidBalanceException';
import { InvalidFullNameException } from '../../../src/shared/exceptions/InvalidFullNameException';
import { InvalidPasswordException } from '../../../src/shared/exceptions/InvalidPasswordException';

describe('UserClient Entity', () => {
  let user: UserClient;
  let cpf: CPF;
  let email: Email;
  let balance: Balance;

  beforeEach(() => {
    // Balance
    const balanceOrError = Balance.createFromReal(100);
    if (balanceOrError.isLeft()) throw balanceOrError.value;
    balance = balanceOrError.value;

    // CPF
    const cpfOrError = CPF.create('12345678901');
    if (cpfOrError.isLeft()) throw cpfOrError.value;
    cpf = cpfOrError.value;

    // Email
    const emailOrError = Email.create('test@email.com');
    if (emailOrError.isLeft()) throw emailOrError.value;
    email = emailOrError.value;

    // User
    user = UserClient.create({
      fullName: 'John Doe',
      email,
      password: 'securePass123',
      cpf,
      balance,
      createdAt: new Date(),
    }) as UserClient;
  });

  it('should create a UserClient instance with correct attributes', () => {
    expect(user.fullName).toBe('John Doe');
    expect(user.email.toValue).toBe('test@email.com');
    expect(user.cpf.toValue).toBe('12345678901');
    expect(user.balance.valueAsReal).toBe(100);
  });

  it('should add funds to the user balance', () => {
    const result = user.addFunds(50);
    expect(result.isRight()).toBe(true);
    expect((result.value as UserClient).balance.valueAsReal).toBe(150);
  });

  it('should return error if addFunds receives invalid amount', () => {
    const result = user.addFunds(-10);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidBalanceException);
  });

  it('should transfer funds between two users successfully', () => {
    const destCpfOrError = CPF.create('10987654321');
    if (destCpfOrError.isLeft()) throw destCpfOrError.value;
    const destEmailOrError = Email.create('dest@email.com');
    if (destEmailOrError.isLeft()) throw destEmailOrError.value;

    const destBalanceOrError = Balance.createFromReal(50);
    if (destBalanceOrError.isLeft()) throw destBalanceOrError.value;

    const destination = UserClient.create({
      fullName: 'Jane Smith',
      email: destEmailOrError.value,
      password: 'pass1234',
      cpf: destCpfOrError.value,
      balance: destBalanceOrError.value,
      createdAt: new Date(),
    }) as UserClient;

    const transferResult = user.makeTransfer(30, destination);
    expect(transferResult.isRight()).toBe(true);
    expect(user.balance.valueAsReal).toBe(70);
    expect(destination.balance.valueAsReal).toBe(80);
  });

  it('should return error if sender has insufficient balance', () => {
    const destCpfOrError = CPF.create('10987654321');
    if (destCpfOrError.isLeft()) throw destCpfOrError.value;
    const destEmailOrError = Email.create('dest@email.com');
    if (destEmailOrError.isLeft()) throw destEmailOrError.value;

    const destBalanceOrError = Balance.createFromReal(50);
    if (destBalanceOrError.isLeft()) throw destBalanceOrError.value;

    const destination = UserClient.create({
      fullName: 'Jane Smith',
      email: destEmailOrError.value,
      password: 'pass1234',
      cpf: destCpfOrError.value,
      balance: destBalanceOrError.value,
      createdAt: new Date(),
    }) as UserClient;

    const transferResult = user.makeTransfer(200, destination);
    expect(transferResult.isLeft()).toBe(true);
    expect(transferResult.value).toBeInstanceOf(InvalidBalanceException);
    expect(user.balance.valueAsReal).toBe(100);
    expect(destination.balance.valueAsReal).toBe(50);
  });

  it('should rollback sender balance if destination fails', () => {
    const failingDestination = {
      addFunds: () => {
        throw new Error('Destination error');
      },
    } as unknown as UserClient;

    try {
      user.makeTransfer(30, failingDestination);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(user.balance.valueAsReal).toBe(100);
    }
  });

  it('should return correct attributes via getters', () => {
    expect(user.fullName).toBe('John Doe');
    expect(user.email.toValue).toBe('test@email.com');
    expect(user.cpf.toValue).toBe('12345678901');
    expect(user.balance.valueAsReal).toBe(100);
  });

  it('should return error if fullName is invalid', () => {
    const result = user.changeFullName('J');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidFullNameException);
  });

  it('should change fullName successfully', () => {
    const newName = 'John Doe Changed';
    const result = user.changeFullName(newName);
    expect(result.isRight()).toBe(true);
    expect((result.value as UserClient).fullName).toBe(newName);
  });

  it('should return error if password is invalid', () => {
    const result = user.changePassword('123');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPasswordException);
  });

  it('should change password successfully', () => {
    const newPassword = 'newSecurePassword';
    const result = user.changePassword(newPassword);
    expect(result.isRight()).toBe(true);
    expect((result.value as UserClient).password).toBe(newPassword);
  });
});
