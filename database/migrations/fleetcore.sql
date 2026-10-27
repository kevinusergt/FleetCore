-- FleetCore schema for PostgreSQL. Run the NestJS seeder afterwards to populate repeatable sample data.
CREATE TYPE users_role_enum AS ENUM ('ADMIN','TECHNICIAN','MANAGER');
CREATE TYPE vehicles_status_enum AS ENUM ('AVAILABLE','IN_MAINTENANCE','INACTIVE');
CREATE TYPE maintenances_type_enum AS ENUM ('PREVENTIVE','CORRECTIVE');
CREATE TYPE maintenances_status_enum AS ENUM ('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED');
CREATE TABLE users (
 id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, email VARCHAR(180) NOT NULL UNIQUE,
 password VARCHAR NOT NULL, role users_role_enum NOT NULL DEFAULT 'TECHNICIAN', "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE vehicles (
 id SERIAL PRIMARY KEY, plate VARCHAR(20) NOT NULL UNIQUE, brand VARCHAR(80) NOT NULL, model VARCHAR(80) NOT NULL,
 year INTEGER NOT NULL, mileage INTEGER NOT NULL DEFAULT 0, status vehicles_status_enum NOT NULL DEFAULT 'AVAILABLE'
);
CREATE TABLE mechanics (
 id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(180) NOT NULL UNIQUE,
 specialty VARCHAR(100) NOT NULL, active BOOLEAN NOT NULL DEFAULT true
);
CREATE TABLE workshops (
 id SERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, address VARCHAR(240) NOT NULL, active BOOLEAN NOT NULL DEFAULT true
);
CREATE TABLE maintenances (
 id SERIAL PRIMARY KEY, type maintenances_type_enum NOT NULL, description TEXT NOT NULL, mileage INTEGER NOT NULL,
 "scheduledAt" TIMESTAMP NOT NULL, "scheduledEndAt" TIMESTAMP NULL, status maintenances_status_enum NOT NULL DEFAULT 'SCHEDULED',
 "workPerformed" TEXT NULL, "finalCost" NUMERIC(12,2) NULL, "completedAt" TIMESTAMP NULL, "finalMileage" INTEGER NULL,
 "vehicleId" INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
 "mechanicId" INTEGER NOT NULL REFERENCES mechanics(id) ON DELETE RESTRICT,
 "workshopId" INTEGER NOT NULL REFERENCES workshops(id) ON DELETE RESTRICT,
 "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_maintenances_vehicle_status ON maintenances("vehicleId",status);
CREATE INDEX idx_maintenances_mechanic_schedule ON maintenances("mechanicId","scheduledAt");
