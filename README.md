# FleetCore API

**Coder:** kevin villalobos ruiz 
**Ruta:** NodeJS/Nestjs 
API REST NestJS + TypeScript + TypeORM + PostgreSQL it helps you manage vehicles, mechanics, workshops, and maintenance.

## Requirements
Node.js 20+, npm y PostgreSQL 14+ (o Docker).

## Local starting
1. Copy the file .env.example and rename it to .env. Add your information.
2. Install the packages: Run npm install in your terminal.
3. Start PostgreSQL and create a database named fleet_core.
4. Add test data: Run npm run seed. You can run this multiple times safely.
5. Start the server: Run npm run start:dev.
6. Open Swagger documentation at: http://localhost:3000/docs

Note: You can find the database structure in database/fleetcore.sql.

## Docker
1. Set up your .env file.
2. Run docker compose up --build.
3. To add test data inside Docker, run: docker compose exec app npm run seed.

## Authentication
- POST /api/auth/register: Create a new user with the TECHNICIAN role.
- POST /api/auth/login: Get a JWT token. In Swagger, click "Authorize" and type Bearer <token>.
- Note: Only the Admin or the seed script can create ADMIN and MANAGER users. You cannot create them using the public register link.
- External Systems: GET /api/integrations/maintenance-summary needs an x-api-key in the header.

## User Roles
- ADMIN: Can create, read, update, and delete everything.
- TECHNICIAN: Can see maintenance tasks and change their status. Important: The technician user account and the mechanic profile must use the same email address.

## Status and Rules
- Vehicles: Can be AVAILABLE (ready), IN_MAINTENANCE (fixing), or INACTIVE (disabled).
- Maintenance: Can be SCHEDULED, IN_PROGRESS, COMPLETED, or CANCELLED.
- Note: You cannot delete vehicles, mechanics, or workshops. You can only make them INACTIVE to keep the history.
- To finish a maintenance (COMPLETED), you must provide: work done description, cost, end date, and final mileage.

