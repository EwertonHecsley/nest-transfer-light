import Entity from '../../../../core/domain/generics/Entity';
import Identity from '../../../../core/domain/generics/Identity';
import { CNPJ } from '../objectValues/CNPJ';
import { Email } from '../../../../core/domain/userClient/objectValues/Email';
import { Balance } from '../../../../core/domain/userClient/objectValues/Balance';
import { Either, left, right } from '../../../../shared/utils/either';
import { InvalidBalanceException } from '../../../../shared/exceptions/InvalidBalanceException';
import { InvalidFullNameException } from '../../../../shared/exceptions/InvalidFullNameException';
import { InvalidEmailException } from '../../../../shared/exceptions/InvalidEmailException';
import { InvalidCnpjException } from '../../../../shared/exceptions/InvalidCnpjException';
import { InvalidPasswordException } from '../../../../shared/exceptions/InvalidPasswordException';

type UserStoreProps = {
  fullName: string;
  cnpj: CNPJ;
  email: Email;
  password: string;
  balance: Balance;
  createdAt: Date;
};

export class UserStore extends Entity<UserStoreProps> {
  private constructor(props: UserStoreProps, id?: Identity) {
    super(props, id);
  }

  static create(props: UserStoreProps, id?: Identity) {
    return new UserStore({ ...props }, id);
  }

  addFunds(amount: number): Either<InvalidBalanceException, UserStore> {
    if (amount <= 0) {
      return left(new InvalidBalanceException('Amount must be positive.'));
    }

    const newBalanceOrError = this.balance.add(amount);
    if (newBalanceOrError.isLeft()) return left(newBalanceOrError.value);

    this._attibutes.balance = newBalanceOrError.value;
    return right(this);
  }

  get fullName(): string {
    return this._attibutes.fullName;
  }

  get balance(): Balance {
    return this._attibutes.balance;
  }

  get password(): string {
    return this._attibutes.password;
  }

  get cnpj(): CNPJ {
    return this._attibutes.cnpj;
  }

  get email(): Email {
    return this._attibutes.email;
  }

  get createdAt(): Date {
    return this._attibutes.createdAt;
  }

  public changeFullName(
    newFullName: string,
  ): Either<InvalidFullNameException, UserStore> {
    if (!newFullName || newFullName.trim().length < 3)
      return left(new InvalidFullNameException());
    this._attibutes.fullName = newFullName.trim();
    return right(this);
  }

  public changeEmail(
    newEmail: string,
  ): Either<InvalidEmailException, UserStore> {
    const newEmailOrError = Email.create(newEmail);
    if (newEmailOrError.isLeft()) return left(new InvalidEmailException());
    this._attibutes.email = newEmailOrError.value;
    return right(this);
  }

  public changeCnpj(newCnpj: string): Either<InvalidCnpjException, UserStore> {
    const newCnpjOrError = CNPJ.create(newCnpj);
    if (newCnpjOrError.isLeft()) return left(new InvalidCnpjException());
    this._attibutes.cnpj = newCnpjOrError.value;
    return right(this);
  }

  public changePassword(
    newPassword: string,
  ): Either<InvalidPasswordException, UserStore> {
    if (!newPassword || newPassword.trim().length < 4)
      return left(new InvalidPasswordException());
    this._attibutes.password = newPassword.trim();
    return right(this);
  }
}
