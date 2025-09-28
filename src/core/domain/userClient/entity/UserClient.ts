import { Either, left, right } from '@/shared/utils/either';
import Entity from '../../generics/Entity';
import Identity from '../../generics/Identity';
import { Balance } from '../objectValues/Balance';
import { CPF } from '../objectValues/CPF';
import { Email } from '../objectValues/Email';
import { InvalidBalanceException } from '@/shared/exceptions/InvalidBalanceException';

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
}
