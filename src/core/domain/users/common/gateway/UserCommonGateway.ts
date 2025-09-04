import { UserCommon } from '../entity/UserCommon';

export abstract class UserCommonGateway {
  abstract create(entity: UserCommon): Promise<UserCommon>;
  abstract findByEmail(email: string): Promise<UserCommon | null>;
  abstract findByCpf(cpf: string): Promise<UserCommon | null>;
  abstract findById(id: string): Promise<UserCommon | null>;
}
