import { Either, left, right } from '../../../../shared/utils/either';
import { BadRequestException } from '@nestjs/common';

export class CPF {
  private readonly value: string;

  private constructor(cpf: string) {
    this.value = cpf;
  }

  public static create(cpf: string): Either<BadRequestException, CPF> {
    const cleanedCpf = cpf.replace(/\D/g, '');
    const isValid = this.validate(cpf);
    if (!isValid) return left(new BadRequestException('Invalid CPF format'));

    return right(new CPF(cleanedCpf));
  }

  private static validate(cpf: string): boolean {
    const cleanedCpf = cpf.replace(/\D/g, '');
    const cpfRegex = /^\d{11}$/;

    return cpfRegex.test(cleanedCpf);
  }

  get toValue(): string {
    return this.value;
  }

  public toFormattedValue(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
