import { BadRequestException } from '@nestjs/common';
import { UserClientGateway } from '../../../../src/core/domain/ports/UserClientGateway';
import { UserClient } from '../../../../src/core/domain/userClient/entity/UserClient';
import { InvalidBalanceException } from '../../../../src/shared/exceptions/InvalidBalanceException';
import { InvalidCpfException } from '../../../../src/shared/exceptions/InvalidCpfException';
import { InvalidEmailException } from '../../../../src/shared/exceptions/InvalidEmailException';
import { Either, left, right } from '../../../../src/shared/utils/either';
import { UserClientFactory } from './factory/CreateUserClient.factory';
import { HashPasswordGateway } from 'core/domain/ports/HashPasswordGateway';

type UserClientRequest = {
  fullName: string;
  cpf: string;
  email: string;
  password: string;
};

export class CreateUserClientUseCase {
  constructor(
    private readonly userClientGateway: UserClientGateway,
    private readonly hashPasswordGateway: HashPasswordGateway,
  ) {}

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
    const passwordHash = await this.hashPasswordGateway.hash(user.password);

    const transformPasswordOrError = user.changePassword(passwordHash);
    if (transformPasswordOrError.isLeft())
      return left(transformPasswordOrError.value);

    await this.userClientGateway.create(user);

    return right(user);
  }
}
