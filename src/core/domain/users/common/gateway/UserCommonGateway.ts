import { UserCommon } from '../entity/UserCommon';

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

export abstract class UserCommonGateway {
  abstract create(entity: UserCommon): Promise<UserCommon>;
  abstract findByEmail(email: string): Promise<UserCommon | null>;
  abstract findByCpf(cpf: string): Promise<UserCommon | null>;
  abstract findById(id: string): Promise<UserCommon | null>;
  abstract list(params:FindAllParams): Promise<PaginatedResponse<UserCommon>>;
}
