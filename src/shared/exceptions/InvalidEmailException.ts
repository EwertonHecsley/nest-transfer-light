export class InvalidEmailException extends Error {
  statusCode: number;

  constructor(message: string = 'Invalid Email.') {
    super(message);
    this.statusCode = 400;
    this.name = 'InvalidEmail';
  }
}
