import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'infra/database/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly http: HttpHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async check() {
    const checks = [
      {
        name: 'nestjs-docs',
        fn: () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      },
      {
        name: 'database',
        fn: () => this.prisma.pingCheck('database', this.prismaService as any),
      },
      {
        name: 'memory-heap',
        fn: () => this.memory.checkHeap('memory-heap', 150 * 1024 * 1024),
      },
      {
        name: 'storage',
        fn: () =>
          this.disk.checkStorage('storage', {
            path: '/',
            threshold: 250 * 1024 * 1024 * 1024,
          }),
      },
    ];

    const result: Record<
      string,
      { status: 'up' | 'down'; duration: number; error?: string }
    > = {};

    for (const check of checks) {
      const start = Date.now();
      try {
        await check.fn();
        result[check.name] = { status: 'up', duration: Date.now() - start };
      } catch (error: any) {
        result[check.name] = {
          status: 'down',
          duration: Date.now() - start,
          error: error?.message || 'Unknown error',
        };
      }
    }

    const overallStatus = Object.values(result).every((c) => c.status === 'up')
      ? 'ok'
      : 'error';

    return {
      status: overallStatus,
      checks: result,
      timestamp: new Date().toISOString(),
    };
  }
}
