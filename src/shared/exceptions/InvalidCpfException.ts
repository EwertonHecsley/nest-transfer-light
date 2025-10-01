export class InvalidCpfException extends Error {
  statusCode: number;

  constructor(message: string = 'Invalid CPF.') {
    super(message);
    this.statusCode = 400;
    this.name = 'InvalidCpf';
  }
}
