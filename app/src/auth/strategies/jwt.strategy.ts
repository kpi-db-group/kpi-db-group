import {Injectable} from '@nestjs/common';
import {AuthService} from '../auth.service';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private authService: AuthService) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET || 'thisismykickasssecretthatiwilltotallychangelater',
    });
  }

}
