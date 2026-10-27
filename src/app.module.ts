import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { VehiclesModule } from './vehicles/vehicles.module.js';
import { MechanicsModule } from './mechanics/mechanics.module.js';
import { WorkshopsModule } from './workshops/workshops.module.js';
import { MaintenancesModule } from './maintenances/maintenances.module.js';
import { IntegrationsModule } from './integrations/integrations.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres' as const,
        host: c.get<string>('DB_HOST', 'localhost'),
        port: Number(c.get<string>('DB_PORT', '5432')),
        username: c.get<string>('DB_USER', 'postgres'),
        password: c.get<string>('DB_PASSWORD'),
        database: c.get<string>('DB_NAME', 'fleet_core'),
        autoLoadEntities: true,
        synchronize: c.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    AuthModule,
    UserModule,
    VehiclesModule,
    MechanicsModule,
    WorkshopsModule,
    MaintenancesModule,
    IntegrationsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
