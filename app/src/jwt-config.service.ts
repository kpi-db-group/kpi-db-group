import { Injectable } from '@nestjs/common';
import {JwtOptionsFactory, JwtModuleOptions} from '@nestjs/jwt';
import { CustomNodeJsGlobal } from './shared/custom.interface';
declare const global: CustomNodeJsGlobal;

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {

    createJwtOptions(): JwtModuleOptions {
      return {
        secret: global.config.jwt.SECRET,
        signOptions: {
            expiresIn: global.config.jwt.EXPIRESJWT || '1D',
        },
      };
    }
  }