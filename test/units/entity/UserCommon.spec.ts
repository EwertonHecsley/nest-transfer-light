import { UserCommon } from '@/core/domain/users/common/entity/UserCommon';
import { CPF } from '@/core/domain/users/common/objectValues/CPF';
import { Email } from '@/core/domain/users/common/objectValues/Email';
import { Identity } from '@/core/generics/Identity';

describe('UserCommon Entity', () => {
  it('should create a UserCommon entity with a new Identity and valid attributes', () => {
    const cpfResult = CPF.create('123.456.789-00');
    const emailResult = Email.create('john.doe@example.com');

    if (cpfResult.isLeft() || emailResult.isLeft()) {
      throw new Error('Pre-test setup failed for CPF or Email creation.');
    }

    const user = UserCommon.create({
      fullName: 'John Doe',
      cpf: cpfResult.value,
      email: emailResult.value,
      password: 'securePassword123',
      common: true,
      createdAt: new Date(),
    });

    expect(user).toBeDefined();
    expect(user.identity).toBeInstanceOf(Identity);
    expect(user.fullName).toBe('John Doe');
    expect(user.cpf).toBeInstanceOf(CPF);
    expect(user.email).toBeInstanceOf(Email);
    expect(user.password).toBe('securePassword123');
    expect(user.userCommon).toBe(true);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should create a UserCommon entity with a provided Identity', () => {
    const providedId = new Identity('123e4567-e89b-12d3-a456-426614174000');
    const cpfResult = CPF.create('987.654.321-99');
    const emailResult = Email.create('jane.doe@example.com');

    if (cpfResult.isLeft() || emailResult.isLeft()) {
      throw new Error('Pre-test setup failed for CPF or Email creation.');
    }

    const user = UserCommon.create(
      {
        fullName: 'Jane Doe',
        cpf: cpfResult.value,
        email: emailResult.value,
        password: 'anotherSecurePassword',
        common: false,
        createdAt: new Date(),
      },
      providedId,
    );

    expect(user.identity).toBe(providedId);
  });

  it('should expose attributes through getters', () => {
    const cpfResult = CPF.create('111.222.333-44');
    const emailResult = Email.create('test@example.com');

    if (cpfResult.isLeft() || emailResult.isLeft()) {
      throw new Error('Pre-test setup failed for CPF or Email creation.');
    }

    const user = UserCommon.create({
      fullName: 'Test User',
      cpf: cpfResult.value,
      email: emailResult.value,
      password: 'password123',
      common: true,
      createdAt: new Date('2023-01-30'),
    });

    expect(user.fullName).toBe('Test User');
    expect(user.cpf.toValue).toBe('111.222.333-44');
    expect(user.email.toValue).toBe('test@example.com');
    expect(user.password).toBe('password123');
    expect(user.userCommon).toBe(true);
    expect(user.createdAt.getFullYear()).toBe(2023);
  });

  it('should update full name and email', () => {
    const cpfResult = CPF.create('111.222.333-44');
    const emailResult = Email.create('old.email@example.com');

    if (cpfResult.isLeft() || emailResult.isLeft()) {
      throw new Error('Pre-test setup failed for CPF or Email creation.');
    }

    const user = UserCommon.create({
      fullName: 'Old Name',
      cpf: cpfResult.value,
      email: emailResult.value,
      password: 'password123',
      common: true,
      createdAt: new Date(),
    });

    user.updateFullName('New Name');
    expect(user.fullName).toBe('New Name');

    const newEmailResult = Email.create('new.email@example.com');
    if (newEmailResult.isLeft()) {
      throw new Error('Pre-test setup failed for new Email creation.');
    }
    user.updateEmail(newEmailResult.value);
    expect(user.email).toBe(newEmailResult.value);
  });
});
