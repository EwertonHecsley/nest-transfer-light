import { Either, left, right } from '../../../../shared/utils/either';
import Entity from '../../generics/Entity';
import Identity from '../../generics/Identity';
import { Balance } from '../objectValues/Balance';
import { CPF } from '../objectValues/CPF';
import { Email } from '../objectValues/Email';
import { InvalidBalanceException } from '../../../../shared/exceptions/InvalidBalanceException';
import { InvalidFullNameException } from '../../../../shared/exceptions/InvalidFullNameException';
import { InvalidEmailException } from '../../../../shared/exceptions/InvalidEmailException';
import { InvalidCpfException } from '../../../../shared/exceptions/InvalidCpfException';
import { InvalidPasswordException } from '../../../../shared/exceptions/InvalidPasswordException';

type UserClientProps = {
  fullName: string;
  email: Email;
  password: string;
  cpf: CPF;
  balance: Balance;
  createdAt: Date;
};

export class UserClient extends Entity<UserClientProps> {
  private constructor(props: UserClientProps, id?: Identity) {
    super(props, id);
  }

  static create(props: UserClientProps, id?: Identity) {
    return new UserClient({ ...props }, id);
  }

  addFunds(amount: number): Either<InvalidBalanceException, UserClient> {
    if (amount <= 0) {
      return left(new InvalidBalanceException('Amount must be positive.'));
    }

    const newBalanceOrError = this.balance.add(amount);
    if (newBalanceOrError.isLeft()) return left(newBalanceOrError.value);

    this._attibutes.balance = newBalanceOrError.value;
    return right(this);
  }

  makeTransfer(
    amount: number,
    destination: UserClient,
  ): Either<InvalidBalanceException, true> {
    const newSenderBalanceOrError = this.balance.subtract(amount);
    if (newSenderBalanceOrError.isLeft())
      return left(newSenderBalanceOrError.value);

    const newDestinationBalanceOrError = destination.balance.add(amount);

    if (newDestinationBalanceOrError.isLeft()) {
      this._attibutes.balance = this.balance.add(amount).value as Balance;
      return left(newDestinationBalanceOrError.value);
    }

    this._attibutes.balance = newSenderBalanceOrError.value;
    destination._attibutes.balance = newDestinationBalanceOrError.value;

    return right(true);
  }

  get fullName(): string {
    return this._attibutes.fullName;
  }

  get email(): Email {
    return this._attibutes.email;
  }

  get password(): string {
    return this._attibutes.password;
  }

  get cpf(): CPF {
    return this._attibutes.cpf;
  }

  get balance(): Balance {
    return this._attibutes.balance;
  }

  get createdAt(): Date {
    return this._attibutes.createdAt;
  }

  public changeFullName(
    newFullName: string,
  ): Either<InvalidFullNameException, UserClient> {
    if (!newFullName || newFullName.trim().length < 3)
      return left(new InvalidFullNameException());
    this._attibutes.fullName = newFullName.trim();
    return right(this);
  }

  public changeEmail(
    newEmail: string,
  ): Either<InvalidEmailException, UserClient> {
    const newEmailOrError = Email.create(newEmail);
    if (newEmailOrError.isLeft()) return left(new InvalidEmailException());
    this._attibutes.email = newEmailOrError.value;
    return right(this);
  }

  public changeCpf(newCpf: string): Either<InvalidCpfException, UserClient> {
    const newCpfOrError = CPF.create(newCpf);
    if (newCpfOrError.isLeft()) return left(new InvalidCpfException());
    this._attibutes.cpf = newCpfOrError.value;
    return right(this);
  }

  public changePassword(
    newPassword: string,
  ): Either<InvalidPasswordException, UserClient> {
    if (!newPassword || newPassword.trim().length < 4)
      return left(new InvalidPasswordException());
    this._attibutes.password = newPassword.trim();
    return right(this);
  }
}
