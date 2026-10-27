import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
import { Public } from '../common/decorators/auth.decorators.js';
import {
  Maintenance,
  MaintenanceStatus,
} from '../maintenances/entities/maintenance.entity.js';
@ApiTags('External integrations')
@Controller('integrations')
export class IntegrationsController {
  constructor(
    @InjectRepository(Maintenance) private repo: Repository<Maintenance>,
  ) {}
  @Get('maintenance-summary')
  @Public()
  @UseGuards(ApiKeyGuard)
  @ApiHeader({ name: 'x-api-key', required: true })
  async summary() {
    const [total, scheduled, inProgress, completed, cancelled] =
      await Promise.all([
        this.repo.count(),
        this.repo.countBy({ status: MaintenanceStatus.SCHEDULED }),
        this.repo.countBy({ status: MaintenanceStatus.IN_PROGRESS }),
        this.repo.countBy({ status: MaintenanceStatus.COMPLETED }),
        this.repo.countBy({ status: MaintenanceStatus.CANCELLED }),
      ]);
    return { total, scheduled, inProgress, completed, cancelled };
  }
}
