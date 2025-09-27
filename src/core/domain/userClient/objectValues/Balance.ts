import { InvalidBalanceException } from '../../../../shared/exceptions/InvalidBalanceException';
import { Either, left, right } from '../../../../../src/shared/utils/either';

export class Balance {
  private readonly _valueInCents: number;

  private constructor(valueInCents: number) {
    this._valueInCents = valueInCents;
  }

  public static createFromReal(
    amount: number,
  ): Either<InvalidBalanceException, Balance> {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return left(new InvalidBalanceException());
    }

    if (amount < 0) {
      return left(new InvalidBalanceException('Balance cannot be negative.'));
    }

    const valueCents = Math.round(amount * 100);
    return right(new Balance(valueCents));
  }

  public static createFromCents(
    amountInCents: number,
  ): Either<InvalidBalanceException, Balance> {
    if (typeof amountInCents !== 'number' || isNaN(amountInCents)) {
      return left(
        new InvalidBalanceException('Balance must be a valid number.'),
      );
    }

    if (!Number.isInteger(amountInCents)) {
      return left(
        new InvalidBalanceException('Balance in cents must be an integer.'),
      );
    }

    if (amountInCents < 0) {
      return left(new InvalidBalanceException('Balance cannot be negative.'));
    }

    return right(new Balance(amountInCents));
  }

  public add(amountInReal: number): Either<InvalidBalanceException, Balance> {
    if (typeof amountInReal !== 'number' || isNaN(amountInReal)) {
      return left(
        new InvalidBalanceException('Amount to add must be a valid number.'),
      );
    }

    const amountInCentsToAdd = Math.round(amountInReal * 100);
    const newTotalInCents = this.valueInCents + amountInCentsToAdd;

    return Balance.createFromCents(newTotalInCents);
  }

  public subtract(
    amountInReal: number,
  ): Either<InvalidBalanceException, Balance> {
    if (typeof amountInReal !== 'number' || isNaN(amountInReal)) {
      return left(
        new InvalidBalanceException(
          'Amount to subtract must be a valid number.',
        ),
      );
    }

    const amountInCentsToSubtract = Math.round(amountInReal * 100);
    const newTotalInCents = this.valueInCents - amountInCentsToSubtract;

    if (newTotalInCents < 0) {
      return left(new InvalidBalanceException('Insufficient balance.'));
    }

    return right(new Balance(newTotalInCents));
  }

  get valueInCents(): number {
    return this._valueInCents;
  }

  get valueAsReal(): number {
    return this._valueInCents / 100;
  }

  get formatAsReal(): string {
    const valueAsReal = this._valueInCents / 100;
    return valueAsReal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
