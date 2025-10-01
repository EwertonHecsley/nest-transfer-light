import { UserClient } from '../../../../core/domain/userClient/entity/UserClient';
import { Balance } from '../../../../core/domain/userClient/objectValues/Balance';
import { CPF } from '../../../../core/domain/userClient/objectValues/CPF';
import { Email } from '../../../../core/domain/userClient/objectValues/Email';
import { InvalidBalanceException } from '../../../../shared/exceptions/InvalidBalanceException';
import { InvalidCpfException } from '../../../../shared/exceptions/InvalidCpfException';
import { InvalidEmailException } from '../../../../shared/exceptions/InvalidEmailException';
import { Either, left, right } from '../../../../shared/utils/either';

type UserClientRequest = {
  fullName: string;
  cpf: string;
  email: string;
  password: string;
};

export class UserClientFactory {
  static create(
    data: UserClientRequest,
  ): Either<
    InvalidEmailException | InvalidCpfException | InvalidBalanceException,
    UserClient
  > {
    const buildEmail = Email.create(data.email);
    if (buildEmail.isLeft()) return left(new InvalidEmailException());

    const buildCpf = CPF.create(data.cpf);
    if (buildCpf.isLeft()) return left(new InvalidCpfException());

    const buildBalance = Balance.createFromReal(0);
    if (buildBalance.isLeft()) return left(new InvalidBalanceException());

    const userClient = UserClient.create({
      fullName: data.fullName,
      email: buildEmail.value,
      cpf: buildCpf.value,
      password: data.password,
      balance: buildBalance.value,
      createdAt: new Date(),
    });

    return right(userClient);
  }
}
