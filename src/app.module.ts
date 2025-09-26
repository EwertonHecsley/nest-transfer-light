import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
