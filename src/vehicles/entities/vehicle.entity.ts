import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type {Relation} from 'typeorm';
import { Maintenance } from '../../maintenances/entities/maintenance.entity.js';
export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  INACTIVE = 'INACTIVE',
}
@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true, length: 20 }) plate: string;
  @Column({ length: 80 }) brand: string;
  @Column({ length: 80 }) model: string;
  @Column({ type: 'int' }) year: number;
  @Column({ type: 'int', default: 0 }) mileage: number;
  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status: VehicleStatus;
  @OneToMany(() => Maintenance, (m) => m.vehicle) maintenances: Maintenance[];
}
