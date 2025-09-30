import { UserClientGateway } from '@/core/domain/ports/UserClientGateway';
import { UserClient } from '@/core/domain/userClient/entity/UserClient';
import { Either, left, right } from '@/shared/utils/either';
import { BadRequestException } from '@nestjs/common';
import { UserClientFactory } from './factory/CreateUserClient.factory';
import { InvalidEmailException } from '@/shared/exceptions/InvalidEmailException';
import { InvalidBalanceException } from '@/shared/exceptions/InvalidBalanceException';
import { InvalidCpfException } from '@/shared/exceptions/InvalidCpfException';

type UserClientRequest = {
  fullName: string;
  cpf: string;
  email: string;
  password: string;
};

export class CreateUserClientUseCase {
  constructor(private readonly userClientGateway: UserClientGateway) {}

  async execute(
    data: UserClientRequest,
  ): Promise<
    Either<
      | BadRequestException
      | InvalidEmailException
      | InvalidBalanceException
      | InvalidCpfException,
      UserClient
    >
  > {
    const { cpf, email } = data;

    const emailExists = await this.userClientGateway.findByEmail(email);
    if (emailExists)
      return left(new BadRequestException('Email already exists.'));

    const cpfExists = await this.userClientGateway.findByCpf(cpf);
    if (cpfExists) return left(new BadRequestException('CPF already exists.'));

    const createUserOrError = UserClientFactory.create(data);
    if (createUserOrError.isLeft()) return left(createUserOrError.value);

    const user = createUserOrError.value;

    await this.userClientGateway.create(user);

    return right(user);
  }
}
