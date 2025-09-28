import { Email } from '../../../src/core/domain/userClient/objectValues/Email';

describe('Email Value Object', () => {
  // Testes de criação (casos de sucesso)
  it('should create a valid Email object', () => {
    const emailOrError = Email.create('usuario@exemplo.com');
    expect(emailOrError.isRight()).toBe(true);
    const email = emailOrError.value as Email;
    expect(email.toValue).toBe('usuario@exemplo.com');
  });

  // Testes de criação (casos de falha)
  it('should return an error for an empty email', () => {
    const emailOrError = Email.create('');
    expect(emailOrError.isLeft()).toBe(true);
    expect(emailOrError.value).toBe('EMPTY_EMAIL');
  });

  it('should return an error for an email without the @ symbol', () => {
    const emailOrError = Email.create('usuarioexemplo.com');
    expect(emailOrError.isLeft()).toBe(true);
    expect(emailOrError.value).toBe('INVALID_FORMAT');
  });

  it('should return an error for an email without a domain', () => {
    const emailOrError = Email.create('usuario@.com');
    expect(emailOrError.isLeft()).toBe(true);
    expect(emailOrError.value).toBe('INVALID_FORMAT');
  });

  it('should return an error for an email with an invalid domain', () => {
    const emailOrError = Email.create('usuario@exemplo.');
    expect(emailOrError.isLeft()).toBe(true);
    expect(emailOrError.value).toBe('INVALID_FORMAT');
  });

  // Teste do getter `toValue`
  it('should return the correct email string from the getter', () => {
    const emailOrError = Email.create('teste@email.com');
    const email = emailOrError.value as Email;
    expect(email.toValue).toBe('teste@email.com');
  });
});
