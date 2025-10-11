import { Module } from '@nestjs/common';
import { HealthModule } from './healthCheck/health.module';

@Module({
  imports: [HealthModule],
  exports: [HealthModule],
})
export class HttpModule {}
