import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserClientRepository } from '../repositories/UserClientRepository';
import { UserClientGateway } from 'core/domain/ports/UserClientGateway';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserClientGateway,
      useClass: UserClientRepository,
    },
  ],
  exports: [PrismaService, UserClientGateway],
})
export class PrismaModule {}
