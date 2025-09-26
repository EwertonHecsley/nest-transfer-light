import Entity from "../../src/core/domain/generics/Entity";
import Identity from "../../src/core/domain/generics/Identity";


jest.mock('../../src/core/domain/generics/Identity');

class TestEntity extends Entity<{}> {
  constructor(attributes: any, id?: Identity) {
    super(attributes, id);
  }
}

describe('Entity', () => {
  let attributes: any;

  beforeEach(() => {
    attributes = {
      name: 'Test',
      value: 123
    };
  });

  
  it('should be defined', () => {
    const entity = new TestEntity(attributes);
    expect(entity).toBeDefined();
  });

  it('should create a new Identity if none is provided', () => {
    const identityMock = { id: 'mocked-id' };
    (Identity as jest.Mock).mockImplementation(() => identityMock);

    const entity = new TestEntity(attributes);
    expect(entity.identity.id).toBe('mocked-id');
    expect(Identity).toHaveBeenCalledTimes(2);
  });

  it('should use the provided Identity', () => {
    const providedIdentity = new Identity();
    const entity = new TestEntity(attributes, providedIdentity);
    expect(entity.identity).toBe(providedIdentity);
  });

  it('should have the provided attributes', () => {
    const entity = new TestEntity(attributes);
    expect((entity as any)._attibutes).toEqual(attributes);
  });
});