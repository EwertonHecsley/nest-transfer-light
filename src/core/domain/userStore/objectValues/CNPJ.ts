import { Either, left, right } from '../../../../shared/utils/either';
import { BadRequestException } from '@nestjs/common';

export class CNPJ {
  private readonly value: string;

  private constructor(cnpj: string) {
    this.value = cnpj;
  }

  public static create(cnpj: string): Either<BadRequestException, CNPJ> {
    const cleanedCnpj = cnpj.replace(/\D/g, '');
    const isValid = this.validate(cleanedCnpj);
    if (!isValid) return left(new BadRequestException('Invalid CNPJ format'));

    return right(new CNPJ(cleanedCnpj));
  }

  private static validate(cnpj: string): boolean {
    const cleanedCnpj = cnpj.replace(/\D/g, '');
    const cnpjRegex = /^\d{14}$/;

    return cnpjRegex.test(cleanedCnpj);
  }

  get toValue(): string {
    return this.value;
  }

  public toFormattedValue(): string {
    return this.value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    );
  }
}
