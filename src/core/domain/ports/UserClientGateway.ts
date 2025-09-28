import { UserClient } from '../userClient/entity/UserClient';

export abstract class UserClientGateway {
  abstract create(entity: UserClient): Promise<UserClient>;
  abstract findByCpf(cpf: string): Promise<UserClient | null>;
  abstract findByEmail(email: string): Promise<UserClient | null>;
}
