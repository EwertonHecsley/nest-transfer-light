import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserCommonGateway } from '@/core/domain/users/common/gateway/UserCommonGateway';
import { UserCommonRepository } from '../repository/userCommon.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide:UserCommonGateway,
      useClass:UserCommonRepository
    }
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
