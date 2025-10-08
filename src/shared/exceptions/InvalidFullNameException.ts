export class InvalidFullNameException extends Error {
  statusCode: number;
  constructor(message: string = 'Full name must have at least 3 characters.') {
    super(message);
    this.statusCode = 400;
    this.name = 'InvalidFullNameException';
  }
}
