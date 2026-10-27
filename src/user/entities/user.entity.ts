import {Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn} from 'typeorm';
import { Role } from './role.entity.js';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    // Muchos usuarios tienen UN solo rol
  @ManyToOne(() => Role, (role) => role.users, { 
    eager: true, // Carga el rol automáticamente cuando consultas el usuario
    onDelete: 'RESTRICT' // Evita que borren un rol si hay usuarios usándolo
  })
  @JoinColumn({ name: 'role_id' }) // Crea la columna 'role_id' en la base de datos
  role: Role;
}
