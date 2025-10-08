export class InvalidPasswordException extends Error {
  statusCode: number;
  constructor(message: string = 'Password invalid.') {
    super(message);
    this.statusCode = 400;
    this.name = 'InvalidPasswordException';
  }
}
