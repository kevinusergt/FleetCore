import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorators.js';
import { UsersService } from '../../user/user.service.js';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private reflector: Reflector,
    private users: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Permite rutas públicas; en las privadas verifica firma, expiración y usuario existente.

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const req = context.switchToHttp().getRequest();
    const [scheme, token] = (req.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token)
      throw new UnauthorizedException('Token Bearer requerido');
    try {
      const payload = await this.jwt.verifyAsync(token);
      const user = await this.users.findById(payload.sub);
      if (!user) throw new UnauthorizedException('Usuario no válido');
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
