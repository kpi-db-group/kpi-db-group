import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException,} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import {Role} from '../user.dto';
import {JwtPayload} from '../../auth/interfaces/jwt.payload.interface';
import {UserService} from '../service/user.service';
import { CustomNodeJsGlobal } from '../../shared/custom.interface';
declare const global: CustomNodeJsGlobal;

@Injectable()
export class AuthGuard implements CanActivate {
    // TODO review role management for UseGuards we could not use constructore any more
    roles: Role[] = [Role.ALL];

    constructor(
        private userService: UserService,
        ) {

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // TODO zakommentirovano - auth enable
        // if (true) {
        //     return true;
        // }
        console.log(this.userService);
        const request = context.switchToHttp().getRequest();
        if (request) {
            if (!request.headers.authorization) {
                throw new UnauthorizedException('Token not found');
            }
            request.user = await this.validateToken(request.headers.authorization);
            return await this.checkRole(request.user);
        } else {
            const ctx: any = GqlExecutionContext.create(context).getContext();
            if (!ctx.headers.authorization) {
                throw new UnauthorizedException('Token not found');
            }
            ctx.user = await this.validateToken(ctx.headers.authorization);
            return await this.checkRole(ctx.user);
        }
    }

    async checkRole(user: JwtPayload) {
        let access: boolean;
        await this.userService.findUserById(user.id).then(user => {
            if (user) {
                if (user.limitedAccess) {
                    throw new HttpException('User blocked', HttpStatus.UNAUTHORIZED);
                } else {
                    access = true;
                }
            } else {
                throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
            }
        }).catch(err => {
            Logger.error(err);
            const message = 'Authorized error: ' + (err.message || err.name);
            throw new UnauthorizedException(message);
        });
        if (access) {
            const all: string = Role[Role.ALL];
            const guardRoles: string[] = this.roles.map(r => Role[r]);
            const currentRoles: any[] = user.roles;
            if (guardRoles.filter(guardRole => guardRole === all).length > 0) {
                return true;
            }
            return guardRoles.filter(guardRole => currentRoles.some(currRole => guardRole === currRole)).length > 0;
        } else {
            throw new UnauthorizedException('User blocked');
        }
    }

    async validateToken(auth: string) {
        try {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        const token = auth.split(' ')[1];
        const decoded: any = await jwt.verify(token, global.config.jwt.SECRET || 'thisismykickasssecretthatiwilltotallychangelater');
        if (decoded) {
            const user = await this.userService.findUserById(decoded.id);
            if (user) {
                if (user.token === token) {
                    return decoded;
                } else {
                    throw new HttpException('Token mismatch', HttpStatus.UNAUTHORIZED);
                }
            }
            }
        } catch (err) {
            const message = 'Token error: ' + (err.message || err.name);
            throw new UnauthorizedException(message);
        }
    }
}
