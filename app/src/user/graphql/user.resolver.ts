import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UserService} from '../service/user.service';
import {Role, UserDto} from '../user.dto';
import {UseGuards, forwardRef, Inject, OnModuleInit} from '@nestjs/common';
import {AuthGuard} from '../guard/auth.guard';
import {RolesGuard} from '../guard/roles.guard';
import {Roles} from '../../shared/roles.decorator';
import { ModuleRef } from '@nestjs/core';

@Resolver('User')
export class UserResolver implements OnModuleInit {


    constructor(
      @Inject(forwardRef(() => UserService))
      private userService: UserService,
      private readonly moduleRef: ModuleRef,
    ) {}

    @Query()
    async getAllUsers() {
      return this.userService.getAllUsers();
    }

    @Query()
    async getUserById(@Args('_id') _id: string) {
      return this.userService.findUserById(_id)
    }

    @Query()
    async getUnsubscribeStatusById(@Args('_id') _id: string) {
      return this.userService.getUnsubscribeStatusById(_id)
    }

    @Query()
    async getUserByEmail(@Args('email') email: string) {
      return this.userService.findUserByEmail(email);
    }

    @Query()
    async getUsersByRolesAndLang(@Args('roles') roles: Role[],
                                 @Args('lang') lang: string) {
      const user: UserDto = {roles, lang};
      return this.userService.findUsersByRolesAndLang(user);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('BLOCK')
    async createUser(
      @Args('password') password: string,
      @Args('email') email: string,
      @Args('roles') roles: Role[],
    ) {
      const user: UserDto = {password, email, roles};
      return await this.userService.createUser(user);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('BLOCK')
    async updateUser(
      @Args('_id') _id: string,
      @Args('password') password: string,
      @Args('email') email: string,
      @Args('roles') roles: Role[]) {
      const user: UserDto = {password, email, roles};
      return await this.userService.updateUser(_id, user)
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN', 'PATIENT_LID', 'PATIENT', 'SPECIALIST', 'CLINIC')
    async changeUserPassword(
      @Args('_id') _id: string,
      @Args('oldPassword') oldPassword: string,
      @Args('newPassword') newPassword: string) {
      return await this.userService.changeUserPassword(_id, oldPassword, newPassword);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('BLOCK')
    async deleteUser(
      @Args('_id') _id: string) {
      return await this.userService.deleteUser(_id)
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN', 'PATIENT_LID', 'PATIENT', 'SPECIALIST', 'CLINIC')
    async disableUser(
      @Args('_id') _id: string) {
      return await this.calculationService.disableUser(_id)
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN', 'PATIENT_LID', 'PATIENT', 'SPECIALIST', 'CLINIC')
    async activateUser(
      @Args('_id') _id: string) {
      return await this.calculationService.activateUser(_id)
    }

    @Mutation()
    @UseGuards(AuthGuard)
    async updateUserLangById(
      @Args('_id') _id: string,
      @Args('lang') lang: string,
    ) {
      return await this.userService.updateUserLangById(_id, lang);
    }

    @Mutation()
    @UseGuards(AuthGuard)
    async unsubscribeFromEmail(
      @Args('_id') _id: string,
      @Args('value') value: boolean,
    ) {
      return await this.userService.unsubscribeFromEmail(_id, value);
    }
}
