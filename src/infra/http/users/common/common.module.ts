import { CreateUserCommonUseCase } from '@/application/users/common/useCase/Create';
import { EncryptionGateway } from '@/core/domain/users/common/gateway/EncryptonGateway';
import { UserCommonGateway } from '@/core/domain/users/common/gateway/UserCommonGateway';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { CreateUserCommonController } from './controller/create.controller';
import { ServiceModule } from '@/infra/services/service.module';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    {
      provide: CreateUserCommonUseCase,
      useFactory: (
        userCommonRepository: UserCommonGateway,
        encryptionRepository: EncryptionGateway,
      ) => {
        return new CreateUserCommonUseCase(
          userCommonRepository,
          encryptionRepository,
        );
      },
      inject: [UserCommonGateway, EncryptionGateway],
    },
  ],
  controllers: [CreateUserCommonController],
})
export class UserCommonModule {}
