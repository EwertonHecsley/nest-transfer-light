import { Email } from "@/core/domain/users/common/objectValues/Email";


describe('Email Value Object', () => {
  it('should create an Email object for a valid email', () => {
    const validEmailString = 'test@example.com';
    const result = Email.create(validEmailString);

    expect(result.isRight()).toBeTruthy();

    expect(result.value).toBeInstanceOf(Email);
  });

  it('should return the correct value when using the toValue getter', () => {
    const validEmailString = 'user.name@domain.co';
    const result = Email.create(validEmailString);

    expect(result.isRight()).toBeTruthy();

    const emailObject = result.value;

    expect((emailObject as Email).toValue).toBe(validEmailString);
  });

  it('should return an INVALID_FORMAT error for an invalid email without @', () => {
    const invalidEmailString = 'invalid-email.com';
    const result = Email.create(invalidEmailString);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBe('INVALID_FORMAT');
  });

  it('should return an INVALID_FORMAT error for an email with multiple @', () => {
    const anotherInvalidEmailString = 'test@my@domain.com';
    const result = Email.create(anotherInvalidEmailString);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBe('INVALID_FORMAT');
  });

  it('should return an EMPTY_EMAIL error for an empty string', () => {
    const emptyString = '';
    const result = Email.create(emptyString);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBe('EMPTY_EMAIL');
  });

  it('should return an EMPTY_EMAIL error for a null or undefined value', () => {
    const nullValue: any = null;
    const undefinedValue: any = undefined;

    const result1 = Email.create(nullValue);
    const result2 = Email.create(undefinedValue);

    expect(result1.isLeft()).toBeTruthy();
    expect(result1.value).toBe('EMPTY_EMAIL');

    expect(result2.isLeft()).toBeTruthy();
    expect(result2.value).toBe('EMPTY_EMAIL');
  });
});
