import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validate';
import { ServiceModule } from './infra/services/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  controllers: [],
  providers: [
    ServiceModule
  ],
})
export class AppModule {}
