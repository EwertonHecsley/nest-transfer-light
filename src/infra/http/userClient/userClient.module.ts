import { Module } from '@nestjs/common';
import { CreateUserClientUseCase } from 'application/userClient/useCase/Create';
import { ListAllUserClientUseCase } from 'application/userClient/useCase/List';
import { HashPasswordGateway } from 'core/domain/ports/HashPasswordGateway';
import { UserClientGateway } from 'core/domain/ports/UserClientGateway';
import { DatabaseModule } from 'infra/database/database.module';
import { ServiceModule } from 'infra/services/service.module';
import { ListAllUserClientController } from './controllers/list.controller';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    {
      provide: CreateUserClientUseCase,
      useFactory: (
        userClientGateway: UserClientGateway,
        hashPasswordGateway: HashPasswordGateway,
      ) => {
        return new CreateUserClientUseCase(
          userClientGateway,
          hashPasswordGateway,
        );
      },
      inject: [UserClientGateway, HashPasswordGateway],
    },
    {
      provide: ListAllUserClientUseCase,
      useFactory: (userClientGateway: UserClientGateway) => {
        return new ListAllUserClientUseCase(userClientGateway);
      },
      inject: [UserClientGateway],
    },
  ],
  controllers: [ListAllUserClientController],
})
export class UserClientModule {}
