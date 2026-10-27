import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/auth.decorators.js';
import { UserRole } from '../user/entities/user.entity.js';
import { MechanicsService } from './mechanics.service.js';
import { CreateMechanicDto } from './dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './dto/update-mechanic.dto.js';
@ApiTags('Mechanics')
@ApiBearerAuth()
@Controller('mechanics')
export class MechanicsController {
  constructor(private service: MechanicsService) {}
  @Post() @Roles(UserRole.ADMIN) create(@Body() d: CreateMechanicDto) {
    return this.service.create(d);
  }
  @Get() findAll() {
    return this.service.findAll();
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
  @Patch(':id') @Roles(UserRole.ADMIN) update(
    @Param('id', ParseIntPipe) id: number,
    @Body() d: UpdateMechanicDto,
  ) {
    return this.service.update(id, d);
  }
  @Delete(':id') @Roles(UserRole.ADMIN) remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(id);
  }
}
