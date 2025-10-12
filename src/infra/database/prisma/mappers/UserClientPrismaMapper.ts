import { BadRequestException } from '@nestjs/common';
import { UserClient as UserClientDatabase } from '@prisma/client';
import Identity from '../../../../core/domain/generics/Identity';
import { UserClient } from '../../../../core/domain/userClient/entity/UserClient';
import { Balance } from '../../../../core/domain/userClient/objectValues/Balance';
import { CPF } from '../../../../core/domain/userClient/objectValues/CPF';
import { Email } from '../../../../core/domain/userClient/objectValues/Email';

export class UserClientPrismaMapper {
  static toDomain(raw: UserClientDatabase): UserClient {
    const buildEmail = Email.create(raw.email);
    if (buildEmail.isLeft()) throw new BadRequestException(buildEmail.value);

    const builCpf = CPF.create(raw.cpf);
    if (builCpf.isLeft()) throw builCpf.value;

    const buildBalance = Balance.createFromReal(raw.balance);
    if (buildBalance.isLeft()) throw buildBalance.value;

    return UserClient.create(
      {
        fullName: raw.fullName,
        email: buildEmail.value,
        cpf: builCpf.value,
        balance: buildBalance.value,
        password: raw.password,
        createdAt: raw.createdAt,
      },
      new Identity(raw.id),
    );
  }

  static toDatabase(entity: UserClient): UserClientDatabase {
    return {
      id: entity.identity.id,
      fullName: entity.fullName,
      email: entity.email.toValue,
      password: entity.password,
      balance: entity.balance.valueInCents,
      cpf: entity.cpf.toValue,
      createdAt: entity.createdAt,
    };
  }
}
