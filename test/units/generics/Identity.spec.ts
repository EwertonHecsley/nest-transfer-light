import { Identity } from '@/core/generics/Identity';

describe('Identity Value Object', () => {
  it('should create an Identity object with a provided value', () => {
    const providedId = '123e4567-e89b-12d3-a456-426614174000';
    const identity = new Identity(providedId);
    expect(identity.valueId).toBe(providedId);
  });

  it('should create an Identity object with a randomly generated UUID when no value is provided', () => {
    const identity = new Identity();
    expect(identity.valueId).toBeDefined();
    expect(identity.valueId).not.toBeNull();
    expect(typeof identity.valueId).toBe('string');
    expect(identity.valueId.length).toBe(36);
  });
});
