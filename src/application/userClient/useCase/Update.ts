import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserClientGateway } from '../../../core/domain/ports/UserClientGateway';
import { InvalidCpfException } from '../../../shared/exceptions/InvalidCpfException';
import { InvalidEmailException } from '../../../shared/exceptions/InvalidEmailException';
import { InvalidFullNameException } from '../../../shared/exceptions/InvalidFullNameException';
import { Either, left, right } from '../../../shared/utils/either';
import { UserClient } from '../../../core/domain/userClient/entity/UserClient';

type RequestUpdateUserClient = {
  id: string;
  fullName?: string;
  cpf?: string;
  email?: string;
  password?: string;
};

type UpdateUserClientError =
  | BadRequestException
  | InvalidCpfException
  | InvalidEmailException
  | NotFoundException
  | InvalidFullNameException;

export class UpdateUserClientUseCase {
  constructor(private readonly userClientGateway: UserClientGateway) {}

  async execute(
    id: string,
    data: RequestUpdateUserClient,
  ): Promise<Either<UpdateUserClientError, UserClient>> {
    const userExists = await this.userClientGateway.findById(id);
    if (!userExists)
      return left(new NotFoundException('User client not found.'));

    const validationError = await this.validateUniqueness(userExists, id, data);
    if (validationError) {
      return left(validationError);
    }

    const updateError = this.applyUpdatesToEntity(userExists, data);
    if (updateError) {
      return left(updateError);
    }

    await this.userClientGateway.save(userExists);

    return right(userExists);
  }

  private async validateUniqueness(
    user: UserClient,
    id: string,
    data: RequestUpdateUserClient,
  ): Promise<BadRequestException | null> {
    if (data.cpf && data.cpf !== user.cpf.toValue) {
      const cpfExists = await this.userClientGateway.findByCpf(data.cpf);
      if (cpfExists && cpfExists.identity.id !== id)
        return new BadRequestException('CPF already exists for another user.');
    }

    if (data.email && data.email !== user.email.toValue) {
      const emailExists = await this.userClientGateway.findByEmail(data.email);
      if (emailExists && emailExists.identity.id !== id)
        return new BadRequestException(
          'Email already exists for another user.',
        );
    }

    return null;
  }

  private applyUpdatesToEntity(
    user: UserClient,
    data: RequestUpdateUserClient,
  ): UpdateUserClientError | null {
    if (data.fullName && data.fullName !== user.fullName) {
      const updateResult = user.changeFullName(data.fullName);
      if (updateResult.isLeft()) return updateResult.value;
    }

    if (data.cpf && data.cpf !== user.cpf.toValue) {
      const updateResult = user.changeCpf(data.cpf);
      if (updateResult.isLeft()) return updateResult.value;
    }

    if (data.email && data.email !== user.email.toValue) {
      const updateResult = user.changeEmail(data.email);
      if (updateResult.isLeft()) return updateResult.value;
    }

    if (data.password) {
      const updateResult = user.changePassword(data.password);
      if (updateResult.isLeft()) return updateResult.value;
    }

    return null;
  }
}
