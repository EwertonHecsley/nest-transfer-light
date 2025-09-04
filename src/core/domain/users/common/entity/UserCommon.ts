import { Entity } from '@/core/generics/Entity';
import { CPF } from '../objectValues/CPF';
import { Email } from '../objectValues/Email';
import { Identity } from '@/core/generics/Identity';

type UserCommonProps = {
  fullName: string;
  cpf: CPF;
  email: Email;
  password: string;
  common: boolean;
  createdAt: Date;
};

export class UserCommon extends Entity<UserCommonProps> {
  private constructor(attributes: UserCommonProps, id?: Identity) {
    super({ ...attributes, createdAt: attributes.createdAt ?? new Date() }, id);
  }

  public static create(attributes: UserCommonProps, id?: Identity): UserCommon {
    return new UserCommon(
      { ...attributes, createdAt: attributes.createdAt },
      id,
    );
  }

  get fullName(): string {
    return this.attributes.fullName;
  }

  get cpf(): CPF {
    return this.attributes.cpf;
  }

  get email(): Email {
    return this.attributes.email;
  }

  get password(): string {
    return this.attributes.password;
  }

  get userCommon(): boolean {
    return this.attributes.common;
  }

  get createdAt(): Date {
    return this.attributes.createdAt;
  }

  public updateFullName(fullName: string): void {
    this.attributes.fullName = fullName;
  }

  public updateEmail(email: Email): void {
    this.attributes.email = email;
  }

  public updatePassword(password: string): void {
    this.attributes.password = password;
  }
}
