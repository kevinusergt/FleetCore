import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
@Injectable()
export class AuthService {
 constructor(@InjectRepository(User) private users: Repository<User>, private jwt: JwtService) {}
 async register(dto: RegisterDto) {
  const email = dto.email.toLowerCase().trim();
  if (await this.users.findOne({ where: { email } })) throw new ConflictException('El correo ya está registrado');
  const user = this.users.create({ username: dto.username.trim(), email, password: await bcrypt.hash(dto.password, 12), role: UserRole.TECHNICIAN });
  const saved = await this.users.save(user);
  return { id: saved.id, username: saved.username, email: saved.email, role: saved.role };
 }
 async login(dto: LoginDto) {
  const user = await this.users.createQueryBuilder('u').addSelect('u.password').where('u.email = :email', { email: dto.email.toLowerCase().trim() }).getOne();
  if (!user || !(await bcrypt.compare(dto.password, user.password))) throw new UnauthorizedException('Credenciales incorrectas');
  const access_token = await this.jwt.signAsync({ sub: user.id, username: user.username, role: user.role });
  return { access_token, token_type: 'Bearer', user: { id: user.id, username: user.username, email: user.email, role: user.role } };
 }
}
