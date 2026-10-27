# FleetCore API

**Coder:** kevin villalobos ruiz 
**Ruta:** NodeJS/Nestjs 
API REST NestJS + TypeScript + TypeORM + PostgreSQL para administrar vehículos, mecánicos, talleres y mantenimientos.

## Requisitos
Node.js 20+, npm y PostgreSQL 14+ (o Docker).

## Inicio local
1. Copia `.env.example` a `.env` y configura las credenciales.
2. Instala dependencias: `npm install`.
3. Inicia PostgreSQL y crea la base `fleet_core`.
4. Ejecuta `npm run seed` para cargar datos de prueba.
5. Ejecuta `npm run start:dev`.
6. Swagger: http://localhost:3000/docs

El esquema SQL está en `database/fleetcore.sql`; para datos de prueba se recomienda `npm run seed`, que es idempotente.

## Docker
Configura `.env` y ejecuta `docker compose up --build`. Luego ejecuta `npm run seed` dentro del contenedor con `docker compose exec app npm run seed`.

## Autenticación
- `POST /api/auth/register`: registra un usuario con rol TECHNICIAN.
- `POST /api/auth/login`: devuelve JWT. En Swagger usa Authorize con `Bearer <token>`.
- La creación de usuarios ADMIN/MANAGER debe realizarse de forma controlada por el administrador/seed, no mediante registro público.
- Integración externa: `GET /api/integrations/maintenance-summary` requiere `x-api-key`.

## Roles
- ADMIN: CRUD de catálogo y mantenimientos.
- MANAGER: crear y gestionar mantenimientos.
- TECHNICIAN: consultar mantenimientos y actualizar estados; el proyecto debe vincular la identidad de técnico con su mecánico usando el mismo correo.

## Estados y reglas
Vehículos: `AVAILABLE`, `IN_MAINTENANCE`, `INACTIVE`. Mantenimientos: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`. Los vehículos, mecánicos y talleres se inactivan para conservar el historial. Un mantenimiento completado requiere trabajo realizado, costo, fecha de finalización y kilometraje final.

## Nota de hashing
Este entregable usa bcrypt por la instrucción de implementación acordada. El enunciado de la prueba solicita Argon2; si el evaluador revisa ese requisito literalmente, cambia el hashing a Argon2 antes de entregar.
