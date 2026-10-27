import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum UserRole { ADMIN = 'ADMIN', TECHNICIAN = 'TECHNICIAN', MANAGER = 'MANAGER' }
@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100 }) username: string;
  @Column({ unique: true, length: 180 }) email: string;
  @Column({ select: false }) password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.TECHNICIAN }) role: UserRole;
  @CreateDateColumn() createdAt: Date;
}
