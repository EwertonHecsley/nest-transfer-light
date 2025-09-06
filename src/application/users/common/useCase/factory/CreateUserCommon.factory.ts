import { UserCommon } from '@/core/domain/users/common/entity/UserCommon';
import { CPF } from '@/core/domain/users/common/objectValues/CPF';
import { Email } from '@/core/domain/users/common/objectValues/Email';
import { Either, left, right } from '@/shared/utils/either';
import { BadRequestException } from '@nestjs/common';

type CreateUserDto = {
  fullName: string;
  cpf: string;
  email: string;
  password: string;
  saldo: number;
  common: boolean;
  createdAt?: Date;
};

export class UserCommonFactory {
  static create(dto: CreateUserDto): Either<BadRequestException, UserCommon> {
    const { fullName, email, cpf, password, saldo, createdAt } = dto;
    if (!fullName)
      return left(new BadRequestException('Full name is required.'));
    if (!email) return left(new BadRequestException('Email is required.'));
    if (!cpf) return left(new BadRequestException('CPF is required.'));
    if (!password)
      return left(new BadRequestException('Password is required.'));
    if (!saldo) return left(new BadRequestException('Saldo is required.'));
    if (saldo < 0) return left(new BadRequestException('Value is invalid.'));

    const emailValid = Email.create(email);
    if (emailValid.isLeft())
      return left(new BadRequestException('Email invalid.'));

    const cpfValid = CPF.create(cpf);
    if (cpfValid.isLeft()) return left(new BadRequestException('CPF Invalid.'));

    const user = UserCommon.create({
      fullName,
      cpf: cpfValid.value,
      email: emailValid.value,
      password,
      saldo,
      common: true,
      createdAt: createdAt ?? new Date(),
    });

    return right(user);
  }
}
