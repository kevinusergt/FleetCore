import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type {Relation} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../../workshops/entities/workshop.entity.js';
export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
}
export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
@Entity('maintenances')
export class Maintenance {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'enum', enum: MaintenanceType }) type: MaintenanceType;
  @Column({ type: 'text' }) description: string;
  @Column({ type: 'int' }) mileage: number;
  @Column({ type: 'timestamp' }) scheduledAt: Date;
  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus;
  @Column({ type: 'timestamp', nullable: true }) scheduledEndAt: Date | null;
  @Column({ type: 'text', nullable: true }) workPerformed: string | null;
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  finalCost: string | null;
  @Column({ type: 'timestamp', nullable: true }) completedAt: Date | null;
  @Column({ type: 'int', nullable: true }) finalMileage: number | null;
  @ManyToOne(() => Vehicle, (v) => v.maintenances, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Relation<Vehicle>;
  @ManyToOne(() => Mechanic, (m) => m.maintenances, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'mechanicId' })
  mechanic: Mechanic;
  @ManyToOne(() => Workshop, (w) => w.maintenances, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'workshopId' })
  workshop: Workshop;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
