import {Column, PrimaryGeneratedColumn, Entity, OneToMany} from 'typeorm';
import { User } from './user.entity.js';

@Entity('roles')
export class Role{
     @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ej: 'admin', 'user', 'moderator'

  @Column({ nullable: true })
  description: string;

  // Relación inversa: Un rol puede pertenecer a muchos usuarios
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}