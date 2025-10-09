import { UserStore } from '../../../src/core/domain/userStore/entity/UserStore';
import { Balance } from '../../../src/core/domain/userClient/objectValues/Balance';
import { CNPJ } from '../../../src/core/domain/userStore/objectValues/CNPJ';
import { Email } from '../../../src/core/domain/userClient/objectValues/Email';
import { InvalidBalanceException } from '../../../src/shared/exceptions/InvalidBalanceException';
import { InvalidFullNameException } from '../../../src/shared/exceptions/InvalidFullNameException';
import { InvalidPasswordException } from '../../../src/shared/exceptions/InvalidPasswordException';
import { InvalidCnpjException } from '../../../src/shared/exceptions/InvalidCnpjException';
import { InvalidEmailException } from '../../../src/shared/exceptions/InvalidEmailException';

describe('UserStore Entity', () => {
  let userStore: UserStore;
  let cnpj: CNPJ;
  let email: Email;
  let balance: Balance;

  beforeEach(() => {
    // Balance
    const balanceOrError = Balance.createFromReal(1000);
    if (balanceOrError.isLeft()) throw balanceOrError.value;
    balance = balanceOrError.value;

    // CNPJ
    const cnpjOrError = CNPJ.create('12345678000195');
    if (cnpjOrError.isLeft()) throw cnpjOrError.value;
    cnpj = cnpjOrError.value;

    // Email
    const emailOrError = Email.create('store@email.com');
    if (emailOrError.isLeft()) throw emailOrError.value;
    email = emailOrError.value;

    // UserStore
    userStore = UserStore.create({
      fullName: 'My Store',
      email,
      password: 'storePassword123',
      cnpj,
      balance,
      createdAt: new Date(),
    });
  });

  it('should create a UserStore instance with correct attributes', () => {
    expect(userStore.fullName).toBe('My Store');
    expect(userStore.email.toValue).toBe('store@email.com');
    expect(userStore.cnpj.toValue).toBe('12345678000195');
    expect(userStore.balance.valueAsReal).toBe(1000);
  });

  it('should add funds to the user balance', () => {
    const result = userStore.addFunds(500);
    expect(result.isRight()).toBe(true);
    expect((result.value as UserStore).balance.valueAsReal).toBe(1500);
  });

  it('should return error if addFunds receives invalid amount', () => {
    const result = userStore.addFunds(-100);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidBalanceException);
  });

  it('should return error if fullName is invalid', () => {
    const result = userStore.changeFullName('S');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidFullNameException);
  });

  it('should change fullName successfully', () => {
    const newName = 'My Awesome Store';
    const result = userStore.changeFullName(newName);
    expect(result.isRight()).toBe(true);
    expect((result.value as UserStore).fullName).toBe(newName);
  });

  it('should return error if email is invalid', () => {
    const result = userStore.changeEmail('invalid-email');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailException);
  });

  it('should change email successfully', () => {
    const newEmail = 'new-store@email.com';
    const result = userStore.changeEmail(newEmail);
    expect(result.isRight()).toBe(true);
    expect((result.value as UserStore).email.toValue).toBe(newEmail);
  });

  it('should return error if cnpj is invalid', () => {
    const result = userStore.changeCnpj('123');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCnpjException);
  });

  it('should change cnpj successfully', () => {
    const newCnpj = '98765432000198';
    const result = userStore.changeCnpj(newCnpj);
    expect(result.isRight()).toBe(true);
    expect((result.value as UserStore).cnpj.toValue).toBe(newCnpj);
  });

  it('should return error if password is invalid', () => {
    const result = userStore.changePassword('123');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPasswordException);
  });

  it('should change password successfully', () => {
    const newPassword = 'newStrongPassword';
    const result = userStore.changePassword(newPassword);
    expect(result.isRight()).toBe(true);
    expect((result.value as UserStore).password).toBe(newPassword);
  });

  it('should return correct attributes via getters', () => {
    expect(userStore.fullName).toBe('My Store');
    expect(userStore.email.toValue).toBe('store@email.com');
    expect(userStore.cnpj.toValue).toBe('12345678000195');
    expect(userStore.balance.valueAsReal).toBe(1000);
    expect(userStore.password).toBe('storePassword123');
    expect(userStore.createdAt).toBeInstanceOf(Date);
  });
});
