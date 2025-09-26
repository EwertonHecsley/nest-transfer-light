import Identity from './Identity';

export default class Entity<T> {
  private readonly _identity: Identity;
  protected _attibutes: T;

  protected constructor(attributes: T, id?: Identity) {
    this._attibutes = attributes;
    this._identity = id ?? new Identity();
  }

  get identity(): Identity {
    return this._identity;
  }
}
