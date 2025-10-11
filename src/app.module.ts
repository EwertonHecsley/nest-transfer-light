import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validate';
import { HttpModule } from 'infra/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
