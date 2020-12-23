import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserResolver } from './graphql/user.resolver';
import { UserRepository } from './user.schema';
import {AuthGuard} from './guard/auth.guard';
import { DisableUsersScheduleService } from './disableUsersScheduleService';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
    ],
    // components: [],
    exports: [
        UserService,
        AuthGuard,
    ],
    providers: [
        UserService,
        UserResolver,
        AuthGuard,
        DisableUsersScheduleService,
    ],
})
export class UserModule {}
