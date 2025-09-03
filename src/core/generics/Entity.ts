import { Identity } from './Identity';

export class Entity<T> {
  private _identity: Identity;
  protected attributes: T;

  protected constructor(attributes: T, id?: Identity) {
    this.attributes = attributes;
    this._identity = id ?? new Identity();
  }

  get identity(): Identity {
    return this._identity;
  }
}
