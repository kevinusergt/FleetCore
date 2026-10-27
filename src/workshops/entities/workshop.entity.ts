import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Maintenance } from '../../maintenances/entities/maintenance.entity.js';
@Entity('workshops')
export class Workshop {
  @PrimaryGeneratedColumn() 
  id: number;
  @Column({ length: 120 }) 
  name: string;
  @Column({ length: 240 }) 
  address: string;
  @Column({ default: true }) 
  active: boolean;
  @OneToMany(() => Maintenance, (m) => m.workshop) 
  maintenances: Maintenance[];
}
