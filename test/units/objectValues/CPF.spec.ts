import { BadRequestException } from '@nestjs/common';
import { CPF } from '@/core/domain/users/common/objectValues/CPF';

describe('CPF Value Object', () => {
  it('should create a valid CPF object with a formatted string', () => {
    const validCpfString = '123.456.789-00';

    const result = CPF.create(validCpfString);

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toBeInstanceOf(CPF);
  });

  it('should return a BadRequestException for a non-formatted CPF string', () => {
    const invalidCpfString = '12345678900';
    const result = CPF.create(invalidCpfString);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(BadRequestException);

    expect((result.value as BadRequestException).message).toBe(
      'Invalid CPF format. Expected format: XXX.XXX.XXX-XX',
    );
  });

  it('should return a BadRequestException for an incorrectly formatted CPF', () => {
    const invalidCpfString = '123.456.789_00';
    const result = CPF.create(invalidCpfString);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
  });

  it('should return a BadRequestException for an empty string', () => {
    const invalidCpfString = '';
    const result = CPF.create(invalidCpfString);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(BadRequestException);
  });

  it('should return the correct non-formatted value', () => {
    const validCpfString = '123.456.789-00';
    const result = CPF.create(validCpfString);

    expect(result.isRight()).toBeTruthy();

    const cpf = result.value;

    expect((cpf as CPF).toValue).toBe('123.456.789-00');
  });

  it('should return the correct formatted value', () => {
    const validCpfString = '123.456.789-00';
    const result = CPF.create(validCpfString);

    expect(result.isRight()).toBeTruthy();

    const cpf = result.value;

    expect((cpf as CPF).toFormattedValue()).toBe('123.456.789-00');
  });
});
