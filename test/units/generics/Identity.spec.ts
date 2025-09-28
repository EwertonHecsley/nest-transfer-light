import Identity from '../../../src/core/domain/generics/Identity';
import { randomUUID, UUID } from 'node:crypto';

describe('Identity', () => {
  it('should be defined', () => {
    const identity = new Identity();
    expect(identity).toBeDefined();
  });

  it('should have an id property', () => {
    const identity = new Identity();
    expect(identity).toHaveProperty('id');
  });

  it('should generate a valid UUID when no value is provided', () => {
    const identity = new Identity();
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(identity.id).toMatch(isUUID);
  });

  it('should use the provided UUID value', () => {
    const providedUUID: UUID = randomUUID();
    const identity = new Identity(providedUUID);
    expect(identity.id).toBe(providedUUID);
  });

  it('should return a UUID type', () => {
    const identity = new Identity();
    const isString = typeof identity.id === 'string';
    expect(isString).toBeTruthy();
  });
});
