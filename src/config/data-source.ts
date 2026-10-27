import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { Maintenance } from "../maintenances/entities/maintenance.entity.js";
import { Workshop } from "../workshops/entities/workshop.entity.js";
import { Mechanic } from "../mechanics/entities/mechanic.entity.js";
import { Vehicle } from "../vehicles/entities/vehicle.entity.js";
import { User } from "../user/entities/user.entity.js";
import { parseBooleanEnv } from "./env.js";

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'fleet_core',
  entities: [User, Vehicle, Mechanic, Workshop, Maintenance],
  synchronize: parseBooleanEnv(process.env.DB_SYNCHRONIZE, false),
};

export const AppDataSource = new DataSource(dataSourceOptions);
