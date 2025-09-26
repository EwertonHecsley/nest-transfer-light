import { randomUUID, UUID } from 'node:crypto';

export default class Identity {
  private readonly value: UUID;
  constructor(value?: UUID) {
    this.value = value ?? randomUUID();
  }

  get id(): UUID {
    return this.value;
  }
}
