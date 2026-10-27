import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity.js';
import { CreateMechanicDto } from './dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './dto/update-mechanic.dto.js';
@Injectable()
export class MechanicsService {
  constructor(@InjectRepository(Mechanic) private repo: Repository<Mechanic>) {}
  async create(dto: CreateMechanicDto) {
    if (await this.repo.findOne({ where: { email: dto.email.toLowerCase() } }))
      throw new ConflictException('El correo del mecánico ya existe');
    return this.repo.save(
      this.repo.create({
        ...dto,
        email: dto.email.toLowerCase(),
        active: dto.active ?? true,
      }),
    );
  }
  findAll() {
    return this.repo.find({
      where: { active: true },
      order: { id: 'ASC' },
    });
  }
  async findOne(id: number) {
    const m = await this.repo.findOne({
      where: { id, active: true },
      relations: { maintenances: true },
    });
    if (!m) throw new NotFoundException('Mecánico no encontrado');
    return m;
  }
  async update(id: number, dto: UpdateMechanicDto) {
    const m = await this.repo.findOneBy({ id });
    if (!m) throw new NotFoundException('Mecánico no encontrado');
    Object.assign(m, dto);
    return this.repo.save(m);
  }
  async remove(id: number) {
    return this.update(id, { active: false });
  }
}
