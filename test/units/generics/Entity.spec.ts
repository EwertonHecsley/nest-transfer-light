import { Entity } from '@/core/generics/Entity';
import { Identity } from '@/core/generics/Identity';

// Mock class for testing purposes
class TestAttributes {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class TestEntity extends Entity<TestAttributes> {
  constructor(attributes: TestAttributes, id?: Identity) {
    super(attributes, id);
  }
}

describe('Entity Base Class', () => {
  it('should create an Entity with a provided Identity', () => {
    const providedId = new Identity('123e4567-e89b-12d3-a456-426614174000');
    const attributes = new TestAttributes('Test Name');
    const entity = new TestEntity(attributes, providedId);

    expect(entity.identity).toBeInstanceOf(Identity);
    expect(entity.identity.valueId).toBe(providedId.valueId);
  });

  it('should create an Entity with a new Identity if none is provided', () => {
    const attributes = new TestAttributes('Another Name');
    const entity = new TestEntity(attributes);

    expect(entity.identity).toBeInstanceOf(Identity);
    expect(entity.identity.valueId).toBeDefined();
    expect(typeof entity.identity.valueId).toBe('string');
    expect(entity.identity.valueId.length).toBe(36);
  });

  it('should expose the correct Identity through the getter', () => {
    const providedId = new Identity('98765432-1e2a-3b4c-5d6e-789012345678');
    const attributes = new TestAttributes('Getter Test');
    const entity = new TestEntity(attributes, providedId);

    expect(entity.identity).toBe(providedId);
    expect(entity.identity.valueId).toBe(
      '98765432-1e2a-3b4c-5d6e-789012345678',
    );
  });
});
