export class InvalidBalanceException extends Error {
  statusCode: number;

  constructor(message: string = 'Invalid Balance.') {
    super(message);
    this.statusCode = 400;
    this.name = 'InvalidBalance';
  }
}
