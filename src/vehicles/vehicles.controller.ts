import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/auth.decorators.js';
import { UserRole } from '../user/entities/user.entity.js';
import { VehiclesService } from './vehicles.service.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private service: VehiclesService) {}
  @Post() @Roles(UserRole.ADMIN) create(@Body() dto: CreateVehicleDto) {
    return this.service.create(dto);
  }
  @Get() findAll() {
    return this.service.findAll();
  }
  @Get('by-plate/:plate') findByPlate(@Param('plate') plate: string) {
    return this.service.findByPlate(plate);
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
  @Patch(':id') @Roles(UserRole.ADMIN) update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.service.update(id, dto);
  }
  @Delete(':id') @Roles(UserRole.ADMIN) remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(id);
  }
}
