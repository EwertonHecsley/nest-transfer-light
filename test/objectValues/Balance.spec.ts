import { Balance } from '../../src/core/domain/userClient/objectValues/Balance';
import { InvalidBalanceException } from '../../src/shared/exceptions/InvalidBalanceException';

describe('Balance Value Object', () => {
  // --- Testes de Criação (Success) ---
  describe('Creation - Success', () => {
    it('should create a Balance object from a valid real number', () => {
      const balanceOrError = Balance.createFromReal(123.45);
      expect(balanceOrError.isRight()).toBe(true);
      const balance = balanceOrError.value as Balance;
      expect(balance.valueInCents).toBe(12345);
      expect(balance.valueAsReal).toBe(123.45);
    });

    it('should create a Balance object from a valid integer in cents', () => {
      const balanceOrError = Balance.createFromCents(500);
      expect(balanceOrError.isRight()).toBe(true);
      const balance = balanceOrError.value as Balance;
      expect(balance.valueInCents).toBe(500);
      expect(balance.valueAsReal).toBe(5);
    });

    it('should handle zero balance correctly', () => {
      const balanceOrError = Balance.createFromReal(0);
      expect(balanceOrError.isRight()).toBe(true);
      const balance = balanceOrError.value as Balance;
      expect(balance.valueInCents).toBe(0);
    });
  });

  // --- Testes de Criação (Failures) ---
  describe('Creation - Failures', () => {
    it('should return an error for a negative real number', () => {
      const balanceOrError = Balance.createFromReal(-10);
      expect(balanceOrError.isLeft()).toBe(true);
      expect(balanceOrError.value).toBeInstanceOf(InvalidBalanceException);
    });

    it('should return an error for a negative value in cents', () => {
      const balanceOrError = Balance.createFromCents(-100);
      expect(balanceOrError.isLeft()).toBe(true);
      expect(balanceOrError.value).toBeInstanceOf(InvalidBalanceException);
    });

    it('should return an error for a non-integer value in cents', () => {
      const balanceOrError = Balance.createFromCents(100.5);
      expect(balanceOrError.isLeft()).toBe(true);
      expect(balanceOrError.value).toBeInstanceOf(InvalidBalanceException);
    });

    it('should return an error for a non-number input', () => {
      const balanceOrError = Balance.createFromReal('abc' as any);
      expect(balanceOrError.isLeft()).toBe(true);
      expect(balanceOrError.value).toBeInstanceOf(InvalidBalanceException);
    });

    it('should return an error for NaN input', () => {
      const balanceOrError = Balance.createFromReal(NaN);
      expect(balanceOrError.isLeft()).toBe(true);
      expect(balanceOrError.value).toBeInstanceOf(InvalidBalanceException);
    });
  });

  // --- Testes de Operações (add) ---
  describe('Operations - add', () => {
    it('should add a valid amount and return a new Balance object', () => {
      const initialBalanceOrError = Balance.createFromReal(100.5);
      const initialBalance = initialBalanceOrError.value as Balance;

      const newBalanceOrError = initialBalance.add(25.5);

      expect(newBalanceOrError.isRight()).toBe(true);
      const newBalance = newBalanceOrError.value as Balance;

      expect(newBalance.valueAsReal).toBe(126.0);
      expect(initialBalance.valueAsReal).toBe(100.5); // Garante a imutabilidade
    });

    it('should return an error if the amount to add is invalid', () => {
      const initialBalance = (Balance.createFromReal(100) as any).value;
      const newBalanceOrError = initialBalance.add('invalid' as any);

      expect(newBalanceOrError.isLeft()).toBe(true);
      expect(newBalanceOrError.value).toBeInstanceOf(InvalidBalanceException);
    });
  });

  // --- Testes de Operações (subtract) ---
  describe('Operations - subtract', () => {
    it('should subtract a valid amount and return a new Balance object', () => {
      const initialBalanceOrError = Balance.createFromReal(200);
      const initialBalance = initialBalanceOrError.value as Balance;

      const newBalanceOrError = initialBalance.subtract(75.5);

      expect(newBalanceOrError.isRight()).toBe(true);
      const newBalance = newBalanceOrError.value as Balance;

      expect(newBalance.valueAsReal).toBe(124.5);
      expect(initialBalance.valueAsReal).toBe(200); // Garante a imutabilidade
    });

    it('should return an error for insufficient balance', () => {
      const initialBalanceOrError = Balance.createFromReal(50);
      const initialBalance = initialBalanceOrError.value as Balance;

      const newBalanceOrError = initialBalance.subtract(75);

      expect(newBalanceOrError.isLeft()).toBe(true);
      expect(newBalanceOrError.value).toBeInstanceOf(InvalidBalanceException);
    });
  });

  // --- Testes de Getters ---
  describe('Getters', () => {
    it('should correctly format the value as a real currency string', () => {
      const balanceOrError = Balance.createFromReal(99.99);
      const balance = balanceOrError.value as Balance;

      // O 'R$' pode variar, então testamos o conteúdo
      expect(balance.formatAsReal).toContain('R$');
      expect(balance.formatAsReal).toContain('99,99');
    });

    it('should return the value in cents', () => {
      const balanceOrError = Balance.createFromReal(15.2);
      const balance = balanceOrError.value as Balance;

      expect(balance.valueInCents).toBe(1520);
    });
  });
});
