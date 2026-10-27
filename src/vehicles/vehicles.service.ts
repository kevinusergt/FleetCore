import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Vehicle, VehicleStatus } from './entities/vehicle.entity.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(Vehicle) private repo: Repository<Vehicle>) {}
  async create(dto: CreateVehicleDto) {
    if (await this.repo.findOne({ where: { plate: dto.plate.toUpperCase() } }))
      throw new ConflictException('La placa ya está registrada');
    return this.repo.save(
      this.repo.create({
        ...dto,
        plate: dto.plate.toUpperCase(),
        status: dto.status ?? VehicleStatus.AVAILABLE,
      }),
    );
  }
  findAll() {
    return this.repo.find({
      where: { status: Not(VehicleStatus.INACTIVE) },
      order: { id: 'ASC' },
    });
  }
  async findOne(id: number) {
    const v = await this.repo.findOne({
      where: { id, status: Not(VehicleStatus.INACTIVE) },
      relations: { maintenances: true },
    });
    if (!v) throw new NotFoundException('Vehículo no encontrado');
    return v;
  }
  async findByPlate(plate: string) {
    const v = await this.repo.findOne({
      where: {
        plate: plate.toUpperCase(),
        status: Not(VehicleStatus.INACTIVE),
      },
    });
    if (!v) throw new NotFoundException('Vehículo no encontrado');
    return v;
  }
  async update(id: number, dto: UpdateVehicleDto) {
    const v = await this.repo.findOneBy({ id });
    if (!v) throw new NotFoundException('Vehículo no encontrado');
    if (
      dto.plate &&
      dto.plate.toUpperCase() !== v.plate &&
      (await this.repo.findOne({ where: { plate: dto.plate.toUpperCase() } }))
    )
      throw new ConflictException('La placa ya está registrada');
    Object.assign(v, dto);
    if (dto.plate) v.plate = dto.plate.toUpperCase();
    return this.repo.save(v);
  }
  async remove(id: number) {
    const v = await this.repo.findOneBy({ id });
    if (!v) throw new NotFoundException('Vehículo no encontrado');
    v.status = VehicleStatus.INACTIVE;
    await this.repo.save(v);
    return { message: 'Vehículo inactivado' };
  }
}
