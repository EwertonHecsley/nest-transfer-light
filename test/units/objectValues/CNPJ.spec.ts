import { CNPJ } from '../../../src/core/domain/userStore/objectValues/CNPJ';
import { BadRequestException } from '@nestjs/common';

describe('CNPJ Value Object', () => {
  describe('Creation - Success', () => {
    it('should create a valid CNPJ from an unformatted string', () => {
      const validCnpj = '12345678000195';
      const cnpjOrError = CNPJ.create(validCnpj);
      expect(cnpjOrError.isRight()).toBe(true);
      const cnpj = cnpjOrError.value as CNPJ;
      expect(cnpj.toValue).toBe(validCnpj);
    });

    it('should create a valid CNPJ from a formatted string', () => {
      const validCnpj = '12.345.678/0001-95';
      const cnpjOrError = CNPJ.create(validCnpj);
      expect(cnpjOrError.isRight()).toBe(true);
      const cnpj = cnpjOrError.value as CNPJ;
      expect(cnpj.toValue).toBe('12345678000195');
    });
  });

  describe('Creation - Failures', () => {
    it('should return an error for a short CNPJ string', () => {
      const cnpjOrError = CNPJ.create('123456789');
      expect(cnpjOrError.isLeft()).toBe(true);
      expect(cnpjOrError.value).toBeInstanceOf(BadRequestException);
    });

    it('should return an error for a long CNPJ string', () => {
      const cnpjOrError = CNPJ.create('123456780001951');
      expect(cnpjOrError.isLeft()).toBe(true);
      expect(cnpjOrError.value).toBeInstanceOf(BadRequestException);
    });

    it('should return an error for a CNPJ with non-digit characters', () => {
      const cnpjOrError = CNPJ.create('123abc789-01');
      expect(cnpjOrError.isLeft()).toBe(true);
      expect(cnpjOrError.value).toBeInstanceOf(BadRequestException);
    });
  });

  describe('Formatting', () => {
    it('should return the formatted value correctly', () => {
      const cnpjOrError = CNPJ.create('12345678000195');
      const cnpj = cnpjOrError.value as CNPJ;
      expect(cnpj.toFormattedValue()).toBe('12.345.678/0001-95');
    });

    it('should return the raw value correctly', () => {
      const cnpjOrError = CNPJ.create('12345678000195');
      const cnpj = cnpjOrError.value as CNPJ;
      expect(cnpj.toValue).toBe('12345678000195');
    });
  });
});
