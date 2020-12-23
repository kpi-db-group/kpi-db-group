import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {GqlExecutionContext} from '@nestjs/graphql';
import {AuthGuard} from './auth.guard';
import {JwtPayload} from '../../auth/interfaces/jwt.payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              private readonly authGuard: AuthGuard) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
          return true;
      }
      const request = context.switchToHttp().getRequest();
      if (request) {
          if (!request.headers.authorization) {
              throw new UnauthorizedException('Token not found');
          }
          request.user = await this.authGuard.validateToken(request.headers.authorization);
          return await this.checkRole(request.user, roles);
      } else {
          const ctx: any = GqlExecutionContext.create(context).getContext();
          if (!ctx.headers.authorization) {
              throw new UnauthorizedException('Token not found');
          }
          ctx.user = await this.authGuard.validateToken(ctx.headers.authorization);
          return await this.checkRole(ctx.user, roles);
      }
  }

    async checkRole(user: JwtPayload, roles: string[]) {
        const userRoles: any[] = user.roles;
        const hasRole = () =>
            userRoles.some(role => !!roles.find(item => item === role));
        return user && user.roles && hasRole();
    }
}
