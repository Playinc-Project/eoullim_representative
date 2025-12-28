import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  // Readiness: checks database connectivity (used by ALB / compose readiness)
  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([
      async () => this.db.pingCheck('database'),
    ]);
  }

  // Explicit readiness path
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      async () => this.db.pingCheck('database'),
    ]);
  }

  // Liveness: simple process-level check (no external deps)
  @Get('live')
  live() {
    return { status: 'up' };
  }
}
