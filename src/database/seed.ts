import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/entities/user.entity.js';
import { Vehicle, VehicleStatus } from '../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../workshops/entities/workshop.entity.js';
import {
  Maintenance,
  MaintenanceStatus,
  MaintenanceType,
} from '../maintenances/entities/maintenance.entity.js';
import { AppDataSource } from '../config/data-source.js';

const ds = AppDataSource;

async function run() {
  await ds.initialize();
  try {
    const users = ds.getRepository(User);
    const vehicles = ds.getRepository(Vehicle);
    const mechanics = ds.getRepository(Mechanic);
    const workshops = ds.getRepository(Workshop);
    const maint = ds.getRepository(Maintenance);
    const userSeeds = [
      {
        username: 'Fleet Admin',
        email: 'admin@fleetcore.local',
        password: 'Admin123!',
        role: UserRole.ADMIN,
      },
      {
        username: 'Ana Technician',
        email: 'ana@fleetcore.local',
        password: 'Tech12345!',
        role: UserRole.TECHNICIAN,
      },
      {
        username: 'Luis Technician',
        email: 'luis@fleetcore.local',
        password: 'Tech12345!',
        role: UserRole.TECHNICIAN,
      },
    ];
    for (const s of userSeeds) {
      let u = await users.findOne({ where: { email: s.email } });
      if (!u)
        await users.save(
          users.create({ ...s, password: await bcrypt.hash(s.password, 12) }),
        );
    }
    const mechanicSeeds = [
      {
        name: 'Ana Technician',
        email: 'ana@fleetcore.local',
        specialty: 'Mecánica general',
        active: true,
      },
      {
        name: 'Luis Technician',
        email: 'luis@fleetcore.local',
        specialty: 'Electricidad automotriz',
        active: true,
      },
      {
        name: 'Mecánico Inactivo',
        email: 'inactive@fleetcore.local',
        specialty: 'Motor diésel',
        active: false,
      },
    ];
    for (const s of mechanicSeeds) {
      if (!(await mechanics.findOne({ where: { email: s.email } })))
        await mechanics.save(mechanics.create(s));
    }
    const workshopSeeds = [
      { name: 'Taller Central', address: 'Calle 30 # 10-20', active: true },
      {
        name: 'Taller Norte Inactivo',
        address: 'Carrera 50 # 80-10',
        active: false,
      },
    ];
    for (const s of workshopSeeds) {
      if (!(await workshops.findOne({ where: { name: s.name } })))
        await workshops.save(workshops.create(s));
    }
    const vehicleSeeds = [
      {
        plate: 'FLC101',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        mileage: 42000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        plate: 'FLC102',
        brand: 'Renault',
        model: 'Duster',
        year: 2021,
        mileage: 36000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        plate: 'FLC103',
        brand: 'Chevrolet',
        model: 'Onix',
        year: 2019,
        mileage: 68000,
        status: VehicleStatus.IN_MAINTENANCE,
      },
      {
        plate: 'FLC104',
        brand: 'Mazda',
        model: '3',
        year: 2018,
        mileage: 80000,
        status: VehicleStatus.INACTIVE,
      },
    ];
    for (const s of vehicleSeeds) {
      if (!(await vehicles.findOne({ where: { plate: s.plate } })))
        await vehicles.save(vehicles.create(s));
    }
    const v1 = await vehicles.findOneByOrFail({ plate: 'FLC101' }),
      v3 = await vehicles.findOneByOrFail({ plate: 'FLC103' });
    const m1 = await mechanics.findOneByOrFail({
        email: 'ana@fleetcore.local',
      }),
      m2 = await mechanics.findOneByOrFail({ email: 'luis@fleetcore.local' });
    const w = await workshops.findOneByOrFail({ name: 'Taller Central' });
    if (
      !(await maint.findOne({
        where: { description: 'Cambio de aceite y filtros - historial' },
      }))
    )
      await maint.save(
        maint.create({
          type: MaintenanceType.PREVENTIVE,
          description: 'Cambio de aceite y filtros - historial',
          mileage: 40000,
          scheduledAt: new Date('2026-08-01T08:00:00Z'),
          scheduledEndAt: new Date('2026-08-01T09:00:00Z'),
          status: MaintenanceStatus.COMPLETED,
          workPerformed: 'Cambio de aceite, filtros y revisión general',
          finalCost: '350000',
          completedAt: new Date('2026-08-01T09:00:00Z'),
          finalMileage: 40050,
          vehicle: v1,
          mechanic: m1,
          workshop: w,
        }),
      );
    if (
      !(await maint.findOne({
        where: { description: 'Diagnóstico de frenos en curso' },
      }))
    )
      await maint.save(
        maint.create({
          type: MaintenanceType.CORRECTIVE,
          description: 'Diagnóstico de frenos en curso',
          mileage: v3.mileage,
          scheduledAt: new Date(Date.now() - 30 * 60000),
          scheduledEndAt: new Date(Date.now() + 30 * 60000),
          status: MaintenanceStatus.IN_PROGRESS,
          vehicle: v3,
          mechanic: m2,
          workshop: w,
        }),
      );
    await vehicles.update({ id: v1.id }, { mileage: 40050 });
    await vehicles.update(
      { id: v3.id },
      { status: VehicleStatus.IN_MAINTENANCE },
    );
    console.log('Seed completado sin duplicar registros.');
    console.log('ADMIN: admin@fleetcore.local / Admin123!');
    console.log('TECH: ana@fleetcore.local / Tech12345!');
    console.log('TECH: luis@fleetcore.local / Tech12345!');
  } finally {
    await ds.destroy();
  }
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
