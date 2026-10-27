import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Maintenance } from '../../maintenances/entities/maintenance.entity.js';
@Entity('mechanics')
export class Mechanic {
  @PrimaryGeneratedColumn() 
  id: number;
  @Column({ length: 100 }) 
  name: string;
  @Column({ unique: true, length: 180 }) 
  email: string;
  @Column({ length: 100 }) 
  specialty: string;
  @Column({ default: true }) 
  active: boolean;
  @OneToMany(() => Maintenance, (m) => m.mechanic) 
  maintenances: Maintenance[];
}
