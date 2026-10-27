import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from '../maintenances/entities/maintenance.entity.js';
import { IntegrationsController } from './integrations.controller.js';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
@Module({
  imports: [TypeOrmModule.forFeature([Maintenance])],
  controllers: [IntegrationsController],
  providers: [ApiKeyGuard],
})
export class IntegrationsModule {}
