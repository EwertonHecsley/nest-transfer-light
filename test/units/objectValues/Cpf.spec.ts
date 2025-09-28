import { CPF } from '../../../src/core/domain/userClient/objectValues/CPF';
import { BadRequestException } from '@nestjs/common';

describe('CPF Value Object', () => {
  // Casos de sucesso
  describe('Creation - Success', () => {
    it('should create a valid CPF from an unformatted string', () => {
      const validCpf = '00000000001'; // Exemplo de CPF válido
      const cpfOrError = CPF.create(validCpf);
      expect(cpfOrError.isRight()).toBe(true);
      const cpf = cpfOrError.value as CPF;
      expect(cpf.toValue).toBe(validCpf);
    });

    it('should create a valid CPF from a formatted string', () => {
      const validCpf = '123.456.789-01';
      const cpfOrError = CPF.create(validCpf);
      expect(cpfOrError.isRight()).toBe(true);
      const cpf = cpfOrError.value as CPF;
      expect(cpf.toValue).toBe('12345678901');
    });
  });

  // Casos de falha
  describe('Creation - Failures', () => {
    it('should return an error for a short CPF string', () => {
      const cpfOrError = CPF.create('123456789');
      expect(cpfOrError.isLeft()).toBe(true);
      expect(cpfOrError.value).toBeInstanceOf(BadRequestException);
    });

    it('should return an error for a long CPF string', () => {
      const cpfOrError = CPF.create('123456789012');
      expect(cpfOrError.isLeft()).toBe(true);
      expect(cpfOrError.value).toBeInstanceOf(BadRequestException);
    });

    it('should return an error for a CPF with non-digit characters', () => {
      const cpfOrError = CPF.create('123abc789-01');
      expect(cpfOrError.isLeft()).toBe(true);
      expect(cpfOrError.value).toBeInstanceOf(BadRequestException);
    });
  });

  // Testes de formatação
  describe('Formatting', () => {
    it('should return the formatted value correctly', () => {
      const cpfOrError = CPF.create('12345678901');
      const cpf = cpfOrError.value as CPF;
      expect(cpf.toFormattedValue()).toBe('123.456.789-01');
    });

    it('should return the raw value correctly', () => {
      const cpfOrError = CPF.create('12345678901');
      const cpf = cpfOrError.value as CPF;
      expect(cpf.toValue).toBe('12345678901');
    });
  });
});
