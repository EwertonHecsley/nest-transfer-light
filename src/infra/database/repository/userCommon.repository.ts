import {
  FindAllParams,
  PaginatedResponse,
  UserCommonGateway,
} from '@/core/domain/users/common/gateway/UserCommonGateway';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCommon } from '@/core/domain/users/common/entity/UserCommon';
import { UserCommonMaper } from '../prisma/mapper/userCommon.mapper';

@Injectable()
export class UserCommonRepository implements UserCommonGateway {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: UserCommon): Promise<UserCommon> {
    const data = UserCommonMaper.toDatabase(entity);
    const userCommon = await this.prismaService.userCommon.create({
      data,
    });
    return UserCommonMaper.toDomain(userCommon);
  }

  async findByEmail(email: string): Promise<UserCommon | null> {
    const userCommon = await this.prismaService.userCommon.findUnique({
      where: { email },
    });
    return userCommon ? UserCommonMaper.toDomain(userCommon) : null;
  }

  async findByCpf(cpf: string): Promise<UserCommon | null> {
    const userCommon = await this.prismaService.userCommon.findUnique({
      where: { cpf },
    });
    return userCommon ? UserCommonMaper.toDomain(userCommon) : null;
  }

  async findById(id: string): Promise<UserCommon | null> {
    const userCommon = await this.prismaService.userCommon.findFirst({
      where: { id },
    });
    return userCommon ? UserCommonMaper.toDomain(userCommon) : null;
  }

  async list(params: FindAllParams): Promise<PaginatedResponse<UserCommon>> {
    const { page, limit } = params;
    const total = await this.prismaService.userCommon.count();
    const userCommons = await this.prismaService.userCommon.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    const data = userCommons.map(UserCommonMaper.toDomain);
    return {
      data,
      total,
      page,
      limit,
    };
  }
}
