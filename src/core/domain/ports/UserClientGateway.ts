import { UserClient } from '../userClient/entity/UserClient';

export type FindAllParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
export abstract class UserClientGateway {
  abstract create(entity: UserClient): Promise<UserClient>;
  abstract findByCpf(cpf: string): Promise<UserClient | null>;
  abstract findByEmail(email: string): Promise<UserClient | null>;
  abstract findById(id: string): Promise<UserClient | null>;
  abstract listAll(
    params: FindAllParams,
  ): Promise<PaginatedResponse<UserClient>>;
  abstract save(entity: UserClient): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
