import { Injectable, Logger } from '@nestjs/common';
import {
  FindAllParams,
  PaginatedResponse,
  UserClientGateway,
} from 'core/domain/ports/UserClientGateway';
import { PrismaService } from '../prisma/prisma.service';
import { UserClient } from 'core/domain/userClient/entity/UserClient';
import { UserClientPrismaMapper } from '../prisma/mappers/UserClientPrismaMapper';

@Injectable()
export class UserClientRepository implements UserClientGateway {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: UserClient): Promise<UserClient> {
    const data = UserClientPrismaMapper.toDatabase(entity);
    const result = await this.prismaService.userClient.create({ data });
    return UserClientPrismaMapper.toDomain(result);
  }

  async listAll(params: FindAllParams): Promise<PaginatedResponse<UserClient>> {
    const { page, limit } = params;

    const skip = (page - 1) * limit;

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.userClient.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.userClient.count(),
    ]);

    return {
      data: users.map((p) => UserClientPrismaMapper.toDomain(p)),
      total,
      page,
      limit,
    };
  }

  async findByCpf(cpf: string): Promise<UserClient | null> {
    const user = await this.prismaService.userClient.findUnique({
      where: { cpf },
    });
    return user ? UserClientPrismaMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserClient | null> {
    const user = await this.prismaService.userClient.findUnique({
      where: { email },
    });
    return user ? UserClientPrismaMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<UserClient | null> {
    const user = await this.prismaService.userClient.findUnique({
      where: { id },
    });
    return user ? UserClientPrismaMapper.toDomain(user) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.userClient.delete({ where: { id } });
  }

  async save(entity: UserClient): Promise<void> {
    const data = UserClientPrismaMapper.toDatabase(entity);
    await this.prismaService.userClient.update({
      where: {
        id: entity.identity.id,
      },
      data,
    });
  }
}
