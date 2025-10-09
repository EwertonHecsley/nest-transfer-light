import { NotFoundException } from '@nestjs/common';
import { UserClientGateway } from 'core/domain/ports/UserClientGateway';
import { Either, left, right } from '../../../shared/utils/either';

type RequestUserClient = {
  id: string;
};

export class DeleteUserClientUseCase {
  constructor(private readonly UserClientGateway: UserClientGateway) {}

  async execute({
    id,
  }: RequestUserClient): Promise<Either<NotFoundException, true>> {
    const userExist = await this.UserClientGateway.findById(id);
    if (!userExist) return left(new NotFoundException());

    await this.UserClientGateway.delete(id);
    return right(true);
  }
}
