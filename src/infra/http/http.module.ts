import { Module } from '@nestjs/common';
import { HealthModule } from './healthCheck/health.module';
import { UserClientModule } from './userClient/userClient.module';

@Module({
  imports: [HealthModule, UserClientModule],
  exports: [HealthModule, UserClientModule],
})
export class HttpModule {}
