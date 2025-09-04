import { BadRequestException } from '@nestjs/common';
import { UserCommon } from '@/core/domain/users/common/entity/UserCommon';
import { CPF } from '@/core/domain/users/common/objectValues/CPF';
import { Email } from '@/core/domain/users/common/objectValues/Email';
import { right, left } from '@/shared/utils/either';
import { UserCommonFactory } from '@/application/users/common/useCase/factory/CreateUserCommon.factory';

jest.mock('@/core/domain/users/common/objectValues/Email');
jest.mock('@/core/domain/users/common/objectValues/CPF');
jest.mock('@/core/domain/users/common/entity/UserCommon');

const mockEmailValue = { toValue: 'test@example.com' };
const mockCpfValue = { toValue: '123.456.789-00' };
const mockUserCommon = {
  fullName: 'Test User',
  cpf: mockCpfValue,
  email: mockEmailValue,
  password: 'testPassword',
  common: true,
  createdAt: new Date(),
};

describe('UserCommonFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a UserCommon entity with a valid DTO', () => {
    (Email.create as jest.Mock).mockReturnValue(right(mockEmailValue as Email));
    (CPF.create as jest.Mock).mockReturnValue(right(mockCpfValue as CPF));
    (UserCommon.create as jest.Mock).mockReturnValue(mockUserCommon);

    const dto = {
      fullName: 'Test User',
      email: 'test@example.com',
      cpf: '123.456.789-00',
      password: 'testPassword',
      common: true,
    };
    const result = UserCommonFactory.create(dto);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toBe(mockUserCommon);
  });

  it('should return a BadRequestException for a missing full name', () => {
    const dto = {
      fullName: '',
      email: 'test@example.com',
      cpf: '123.456.789-00',
      password: 'testPassword',
      common: true,
    };
    const result = UserCommonFactory.create(dto);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Full name is required.',
    );
  });

  it('should return a BadRequestException for a missing email', () => {
    const dto = {
      fullName: 'Test User',
      email: '',
      cpf: '123.456.789-00',
      password: 'testPassword',
      common: true,
    };
    const result = UserCommonFactory.create(dto);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Email is required.',
    );
  });

  it('should return a BadRequestException for a missing cpf', () => {
    const dto = {
      fullName: 'Test User',
      email: 'test@example.com',
      cpf: '',
      password: 'testPassword',
      common: true,
    };
    const result = UserCommonFactory.create(dto);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'CPF is required.',
    );
  });

  it('should return a BadRequestException for a missing password', () => {
    const dto = {
      fullName: 'Test User',
      email: 'test@example.com',
      cpf: '123.456.789-00',
      password: '',
      common: true,
    };
    const result = UserCommonFactory.create(dto);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Password is required.',
    );
  });

  it('should return a BadRequestException for an invalid email format', () => {
    (Email.create as jest.Mock).mockReturnValue(
      left(new BadRequestException('Email invalid.')),
    );
    const dto = {
      fullName: 'Test User',
      email: 'invalid-email',
      cpf: '123.456.789-00',
      password: 'testPassword',
      common: true,
    };
    const result = UserCommonFactory.create(dto);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Email invalid.',
    );
  });

  it('should return a BadRequestException for an invalid cpf format', () => {
    (Email.create as jest.Mock).mockReturnValue(right(mockEmailValue as Email));
    (CPF.create as jest.Mock).mockReturnValue(
      left(new BadRequestException('CPF Invalid.')),
    );
    const dto = {
      fullName: 'Test User',
      email: 'test@example.com',
      cpf: 'invalid-cpf',
      password: 'testPassword',
      common: true,
    };
    const result = UserCommonFactory.create(dto);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe('CPF Invalid.');
  });
});
