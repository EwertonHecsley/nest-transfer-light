import { BadRequestException } from '@nestjs/common';
import { UserClient as UserClientDatabase } from '@prisma/client';
import Identity from '../../../src/core/domain/generics/Identity';
import { UserClient } from '../../../src/core/domain/userClient/entity/UserClient';
import { Balance } from '../../../src/core/domain/userClient/objectValues/Balance';
import { CPF } from '../../../src/core/domain/userClient/objectValues/CPF';
import { Email } from '../../../src/core/domain/userClient/objectValues/Email';
import { UserClientPrismaMapper } from '../../../src/infra/database/prisma/mappers/UserClientPrismaMapper';
import { InvalidBalanceException } from '../../../src/shared/exceptions/InvalidBalanceException';
import { InvalidCpfException } from '../../../src/shared/exceptions/InvalidCpfException';

jest.mock('../../../src/core/domain/userClient/objectValues/Email');
jest.mock('../../../src/core/domain/userClient/objectValues/CPF');
jest.mock('../../../src/core/domain/userClient/objectValues/Balance');
jest.mock('../../../src/core/domain/userClient/entity/UserClient');

describe('UserClientPrismaMapper', () => {
  const date = new Date();
  const rawUser: UserClientDatabase = {
    id: 'user-id-123',
    fullName: 'Test User',
    email: 'test@example.com',
    cpf: '12345678900',
    password: 'password123',
    balance: 100.5,
    createdAt: date,
  };

  let mockEmail, mockCpf, mockBalance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockEmail = { toValue: 'test@example.com' };
    mockCpf = { toValue: '12345678900' };
    mockBalance = { valueInCents: 10050 };

    (Email.create as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: mockEmail,
    });
    (CPF.create as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: mockCpf,
    });
    (Balance.createFromReal as jest.Mock).mockReturnValue({
      isLeft: () => false,
      value: mockBalance,
    });
  });

  describe('toDomain', () => {
    it('should map a Prisma UserClient to a domain UserClient entity', () => {
      const mockDomainUser = {} as UserClient;
      (UserClient.create as jest.Mock).mockReturnValue(mockDomainUser);

      const result = UserClientPrismaMapper.toDomain(rawUser);

      expect(Email.create).toHaveBeenCalledWith(rawUser.email);
      expect(CPF.create).toHaveBeenCalledWith(rawUser.cpf);
      expect(Balance.createFromReal).toHaveBeenCalledWith(rawUser.balance);
      expect(UserClient.create).toHaveBeenCalledWith(
        {
          fullName: rawUser.fullName,
          email: mockEmail,
          cpf: mockCpf,
          balance: mockBalance,
          password: rawUser.password,
          createdAt: rawUser.createdAt,
        },
        expect.any(Identity),
      );
      expect(result).toBe(mockDomainUser);
    });

    it('should throw BadRequestException if email is invalid', () => {
      const error = new Error('Invalid email');
      (Email.create as jest.Mock).mockReturnValue({
        isLeft: () => true,
        value: error,
      });

      expect(() => UserClientPrismaMapper.toDomain(rawUser)).toThrow(
        BadRequestException,
      );
      expect(() => UserClientPrismaMapper.toDomain(rawUser)).toThrow(
        'Invalid email',
      );
    });

    it('should throw an exception if CPF is invalid', () => {
      const error = new InvalidCpfException();
      (CPF.create as jest.Mock).mockReturnValue({
        isLeft: () => true,
        value: error,
      });

      expect(() => UserClientPrismaMapper.toDomain(rawUser)).toThrow(
        InvalidCpfException,
      );
    });

    it('should throw an exception if balance is invalid', () => {
      const error = new InvalidBalanceException();
      (Balance.createFromReal as jest.Mock).mockReturnValue({
        isLeft: () => true,
        value: error,
      });

      expect(() => UserClientPrismaMapper.toDomain(rawUser)).toThrow(
        InvalidBalanceException,
      );
    });
  });

  describe('toDatabase', () => {
    it('should map a domain UserClient entity to a Prisma UserClient', () => {
      const domainUser = {
        identity: new Identity('user-id-123'),
        fullName: 'Test User',
        email: mockEmail,
        password: 'password123',
        balance: mockBalance,
        cpf: mockCpf,
        createdAt: date,
      } as UserClient;

      const result = UserClientPrismaMapper.toDatabase(domainUser);

      expect(result).toEqual({
        id: 'user-id-123',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        balance: 10050,
        cpf: '12345678900',
        createdAt: date,
      });
    });
  });
});
