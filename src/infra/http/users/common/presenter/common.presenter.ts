import { UserCommon } from '@/core/domain/users/common/entity/UserCommon';

export class UserCommonPresenter {
  static toHTTP(entity: UserCommon) {
    return {
      id: entity.identity.valueId,
      fullName: entity.fullName,
      email: entity.email.toValue,
      common: entity.userCommon,
      created: entity.createdAt.toLocaleDateString('pt-br', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }
}
