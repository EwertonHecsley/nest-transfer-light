import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserClientGateway } from 'core/domain/ports/UserClientGateway';
import { UserClient } from 'core/domain/userClient/entity/UserClient';
import { Either, left, right } from 'shared/utils/either';

type RequestUserClient = {
  id: string;
};

export class FindUserClientUseCase {
  constructor(private readonly userClientGateway: UserClientGateway) {}

  async execute({
    id,
  }: RequestUserClient): Promise<Either<NotFoundException, UserClient>> {
    if (!id) return left(new BadRequestException('ID invalid value.'));

    const user = await this.userClientGateway.findById(id);
    if (!user) return left(new NotFoundException());

    return right(user);
  }
}
