export class InvalidCnpjException extends Error {
  statusCode: number;

  constructor(message: string = 'Invalid CNPJ.') {
    super(message);
    this.statusCode = 400;
    this.name = 'InvalidCnpj';
  }
}
