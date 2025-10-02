import {
  FindAllParams,
  PaginatedResponse,
  UserClientGateway,
} from 'core/domain/ports/UserClientGateway';
import { UserClient } from 'core/domain/userClient/entity/UserClient';

export class ListAllUserClientUseCase {
  constructor(private readonly userClientGateway: UserClientGateway) {}

  async execute(params: FindAllParams): Promise<PaginatedResponse<UserClient>> {
    return await this.userClientGateway.listAll(params);
  }
}
