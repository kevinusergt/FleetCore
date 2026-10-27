import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  findAll() {
    return this.repo.find({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
  async findOne(id: number) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    const { password, ...safe } = u;
    return safe;
  }
  findById(id: number) {
    return this.repo.findOneBy({ id });
  }
  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.repo.findOne({ where: { email } }))
      throw new ConflictException('El correo ya está registrado');
    const u = await this.repo.save(
      this.repo.create({
        username: dto.username,
        email,
        password: await bcrypt.hash(dto.password, 12),
        role: UserRole.TECHNICIAN,
      }),
    );
    return { id: u.id, username: u.username, email: u.email, role: u.role };
  }
  async update(id: number, dto: Partial<CreateUserDto>) {
    const u = await this.repo.findOneBy({ id });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    if (dto.username !== undefined) u.username = dto.username;
    if (dto.email !== undefined) u.email = dto.email.toLowerCase().trim();
    if (dto.password) u.password = await bcrypt.hash(dto.password, 12);
    const saved = await this.repo.save(u);
    const { password, ...safe } = saved;
    return safe;
  }
  async remove(id: number) {
    const u = await this.repo.findOneBy({ id });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    await this.repo.delete(id);
    return { message: 'Usuario eliminado' };
  }
}
