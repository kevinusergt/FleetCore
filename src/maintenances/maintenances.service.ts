import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; import { DataSource, Repository } from 'typeorm';
import { Maintenance, MaintenanceStatus, MaintenanceType } from './entities/maintenance.entity.js';
import { Vehicle, VehicleStatus } from '../vehicles/entities/vehicle.entity.js'; import { Mechanic } from '../mechanics/entities/mechanic.entity.js'; import { Workshop } from '../workshops/entities/workshop.entity.js';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto.js'; import { UpdateMaintenanceDto } from './dto/update-maintenance.dto.js';
@Injectable() export class MaintenancesService {
 constructor(@InjectRepository(Maintenance) private repo:Repository<Maintenance>, @InjectRepository(Vehicle) private vehicles:Repository<Vehicle>, @InjectRepository(Mechanic) private mechanics:Repository<Mechanic>, @InjectRepository(Workshop) private workshops:Repository<Workshop>, private dataSource:DataSource){}
 async create(dto:CreateMaintenanceDto){
  const vehicle=await this.vehicles.findOneBy({id:dto.vehicleId}); if(!vehicle)throw new NotFoundException('Vehículo no encontrado');
  if(vehicle.status===VehicleStatus.INACTIVE)throw new BadRequestException('No se puede programar un vehículo inactivo');
  if(vehicle.status===VehicleStatus.IN_MAINTENANCE)throw new ConflictException('El vehículo ya tiene un mantenimiento activo');
  if(dto.mileage<vehicle.mileage)throw new BadRequestException('El kilometraje no puede ser menor al kilometraje actual del vehículo');
  const mechanic=await this.mechanics.findOneBy({id:dto.mechanicId}); if(!mechanic)throw new NotFoundException('Mecánico no encontrado'); if(!mechanic.active)throw new BadRequestException('El mecánico está inactivo');
  const workshop=await this.workshops.findOneBy({id:dto.workshopId}); if(!workshop)throw new NotFoundException('Taller no encontrado'); if(!workshop.active)throw new BadRequestException('El taller está inactivo');
  const start=new Date(dto.scheduledAt); const end=dto.scheduledEndAt?new Date(dto.scheduledEndAt):new Date(start.getTime()+60*60*1000); if(end<=start)throw new BadRequestException('La hora de finalización programada debe ser posterior al inicio');
  const active=[MaintenanceStatus.SCHEDULED,MaintenanceStatus.IN_PROGRESS];
  const vehicleActive=await this.repo.findOne({where:active.map(status=>({vehicle:{id:vehicle.id},status}))}); if(vehicleActive)throw new ConflictException('El vehículo ya tiene un mantenimiento activo');
  const mechanicActive=await this.repo.find({where:active.map(status=>({mechanic:{id:mechanic.id},status}))});
  const overlaps=mechanicActive.some(m=>{const ms=new Date(m.scheduledAt).getTime();const me=m.scheduledEndAt?new Date(m.scheduledEndAt).getTime():ms+3600000;return start.getTime()<me && end.getTime()>ms;});
  if(overlaps)throw new ConflictException('El mecánico ya tiene un mantenimiento en ese horario');
  const maintenance=this.repo.create({type:dto.type,description:dto.description,mileage:dto.mileage,scheduledAt:start,scheduledEndAt:end,status:MaintenanceStatus.SCHEDULED,vehicle,mechanic,workshop});
  return this.repo.save(maintenance);
 }
 findAll(){return this.repo.find({relations:{vehicle:true,mechanic:true,workshop:true},order:{scheduledAt:'ASC'}})}
 findActive(){return this.repo.find({where:[{status:MaintenanceStatus.SCHEDULED},{status:MaintenanceStatus.IN_PROGRESS}],relations:{vehicle:true,mechanic:true,workshop:true},order:{scheduledAt:'ASC'}})}
 async findOne(id:number){const m=await this.repo.findOne({where:{id},relations:{vehicle:true,mechanic:true,workshop:true}});if(!m)throw new NotFoundException('Mantenimiento no encontrado');return m}
 findByVehicle(vehicleId:number){return this.repo.find({where:{vehicle:{id:vehicleId}},relations:{vehicle:true,mechanic:true,workshop:true},order:{scheduledAt:'DESC'}})}
 findByMechanic(mechanicId:number){return this.repo.find({where:{mechanic:{id:mechanicId}},relations:{vehicle:true,mechanic:true,workshop:true},order:{scheduledAt:'ASC'}})}
 findByMechanicEmail(email:string){return this.repo.find({where:{mechanic:{email}},relations:{vehicle:true,mechanic:true,workshop:true},order:{scheduledAt:'ASC'}})}
 async update(id:number,dto:UpdateMaintenanceDto){
  const m=await this.repo.findOne({where:{id},relations:{vehicle:true,mechanic:true,workshop:true}});if(!m)throw new NotFoundException('Mantenimiento no encontrado');
  if(!dto.status){ if(m.status===MaintenanceStatus.COMPLETED||m.status===MaintenanceStatus.CANCELLED)throw new BadRequestException('Un mantenimiento cerrado no se puede modificar'); Object.assign(m,dto); return this.repo.save(m); }
  const next=dto.status; if(next===m.status){Object.assign(m,dto);return this.repo.save(m)}
  if(m.status===MaintenanceStatus.COMPLETED)throw new BadRequestException('Un mantenimiento completado no puede cambiar de estado');
  if(m.status===MaintenanceStatus.CANCELLED && [MaintenanceStatus.IN_PROGRESS,MaintenanceStatus.COMPLETED].includes(next))throw new BadRequestException('Un mantenimiento cancelado no puede iniciarse ni completarse');
  if(m.status===MaintenanceStatus.SCHEDULED && ![MaintenanceStatus.IN_PROGRESS,MaintenanceStatus.CANCELLED].includes(next))throw new BadRequestException('Transición de estado no permitida');
  if(m.status===MaintenanceStatus.IN_PROGRESS && ![MaintenanceStatus.COMPLETED,MaintenanceStatus.CANCELLED].includes(next))throw new BadRequestException('Transición de estado no permitida');
  if(next===MaintenanceStatus.COMPLETED){const work=dto.workPerformed??m.workPerformed;const cost=dto.finalCost??(m.finalCost===null?undefined:Number(m.finalCost));const completed=dto.completedAt??m.completedAt;const mileage=dto.finalMileage??m.finalMileage;if(!work?.trim()||cost===undefined||cost===null||!completed||mileage===undefined||mileage===null)throw new BadRequestException('Para completar se requiere workPerformed, finalCost, completedAt y finalMileage');if(mileage<m.mileage)throw new BadRequestException('El kilometraje final no puede ser menor al registrado al crear el mantenimiento');if(mileage<m.vehicle.mileage)throw new BadRequestException('El kilometraje final no puede ser menor al kilometraje actual del vehículo');m.workPerformed=work;m.finalCost=String(cost);m.completedAt=completed instanceof Date ? completed : new Date(completed);m.finalMileage=mileage;m.vehicle.mileage=mileage; m.vehicle.status=VehicleStatus.AVAILABLE; await this.vehicles.save(m.vehicle);}
  if(next===MaintenanceStatus.IN_PROGRESS){m.vehicle.status=VehicleStatus.IN_MAINTENANCE;await this.vehicles.save(m.vehicle)}
  if(next===MaintenanceStatus.CANCELLED && m.vehicle.status===VehicleStatus.IN_MAINTENANCE){m.vehicle.status=VehicleStatus.AVAILABLE;await this.vehicles.save(m.vehicle)}
  m.status=next; if(dto.workPerformed!==undefined)m.workPerformed=dto.workPerformed;if(dto.finalCost!==undefined)m.finalCost=String(dto.finalCost);if(dto.completedAt)m.completedAt=new Date(dto.completedAt);if(dto.finalMileage!==undefined)m.finalMileage=dto.finalMileage;
  return this.repo.save(m);
 }
 async remove(id:number){throw new BadRequestException('No se eliminan mantenimientos para conservar el historial; cambie su estado a CANCELLED')}
}
