import { Injectable } from '@nestjs/common';
import { CreateMechanicDto } from './dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './dto/update-mechanic.dto.js';

@Injectable()
export class MechanicsService {
  create(createMechanicDto: CreateMechanicDto) {
    return 'This action adds a new mechanic';
  }

  findAll() {
    return `This action returns all mechanics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mechanic`;
  }

  update(id: number, updateMechanicDto: UpdateMechanicDto) {
    return `This action updates a #${id} mechanic`;
  }

  remove(id: number) {
    return `This action removes a #${id} mechanic`;
  }
}
