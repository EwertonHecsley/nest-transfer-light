import { UserCommon } from '@/core/domain/users/common/entity/UserCommon';
import { UserCommonGateway } from '@/core/domain/users/common/gateway/UserCommonGateway';
import { Either, left, right } from '@/shared/utils/either';
import { BadRequestException } from '@nestjs/common';
import { UserCommonFactory } from './factory/CreateUserCommon.factory';
import { EncryptionGateway } from '@/core/domain/users/common/gateway/EncryptonGateway';

type RequestCreateUser = {
  fullName: string;
  cpf: string;
  email: string;
  password: string;
  saldo:number;
  common: boolean;
  createdAt: Date;
};

type ResponseCreateUser = Either<BadRequestException, UserCommon>;

export class CreateUserCommonUseCase {
  constructor(
    private readonly userCommonRepository: UserCommonGateway,
    private readonly encryptionRepository: EncryptionGateway,
  ) {}

  async execute(data: RequestCreateUser): Promise<ResponseCreateUser> {
    const existEmail = await this.userCommonRepository.findByEmail(data.email);
    if (existEmail) return left(new BadRequestException('Email is already.'));

    const existCpf = await this.userCommonRepository.findByCpf(data.cpf);
    if (existCpf) return left(new BadRequestException('CPF is alredy.'));

    const userSucessOrError = UserCommonFactory.create(data);
    if (userSucessOrError.isLeft()) return left(userSucessOrError.value);

    const user = userSucessOrError.value;
    const hashPassword = await this.encryptionRepository.hash(user.password);
    user.updatePassword(hashPassword);

    const createdUser = await this.userCommonRepository.create(user);

    return right(createdUser);
  }
}
