import { Module } from '@nestjs/common';
import { HashPasswordGateway } from 'core/domain/ports/HashPasswordGateway';
import { HashPasswordService } from './HashPassword.service';

@Module({
  providers: [
    {
      provide: HashPasswordGateway,
      useClass: HashPasswordService,
    },
  ],
  exports: [HashPasswordGateway],
})
export class ServiceModule {}
