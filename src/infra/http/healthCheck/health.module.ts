import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controller/health.controller';
import { PrismaModule } from 'infra/database/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TerminusModule, PrismaModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
