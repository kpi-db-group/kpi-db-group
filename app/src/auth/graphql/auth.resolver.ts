import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {AuthService} from '../auth.service';
import {AuthDto} from '../auth.dto';
import {Role} from '../../user/user.dto';
import {UseGuards} from '@nestjs/common';
import {AuthGuard} from '../../user/guard/auth.guard';
import { JwtPayload } from '../interfaces/jwt.payload.interface';
import {User as CurrentUser} from '../../shared/user.decorator';

@Resolver('Auth')
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation()
    async login(
        @Args('login') login: string,
        @Args('password') password: string,
        @Args('role') role: Role,
        @Args('rememberMe') rememberMe: boolean,
        @Args('lang') lang: string,
    ) {
        if (login) {
            login = login.toLowerCase();
        }
        const loginAttempt: AuthDto = {login, password, role, rememberMe, lang};
        return await this.authService.login(loginAttempt);
    }

    @Mutation()
    async restorePassword(
        @Args('email') email: string,
    ) {
        if (email) {
            email = email.toLowerCase();
        }
        await this.authService.sendRestoringPasswordMail(email);
    }

    @Mutation()
    @UseGuards(AuthGuard)
    async restorePasswordWithMark(@CurrentUser() user: JwtPayload ) {
      return this.authService.refreshMark(user.id);
    }

}
