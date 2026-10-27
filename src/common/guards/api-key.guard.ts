import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    // La clave esperada solo se lee desde variables de entorno; nunca se hardcodea aquí.

    const expected = this.config.get<string>('API_KEY');
    const supplied = context.switchToHttp().getRequest().headers['x-api-key'];
    if (!expected || supplied !== expected)
      throw new UnauthorizedException('x-api-key inválida');
    return true;
  }
}
