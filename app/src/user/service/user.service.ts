import {Injectable, NotFoundException} from '@nestjs/common';
import {UserDto} from '../user.dto';
import {User} from '../user.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {IUserService} from './user.service.interface';
import * as bcrypt from 'bcrypt';
import {PasswordUtil} from '../../shared/password.util';
import * as uuid from 'uuid/v4';
import {WrongPasswordException} from '../../shared/excpetion/wrong-password.exception';
import {RestoringTokenExpiredException} from '../../shared/excpetion/restoring-token-expired.exception';
import { IdentifierUtil } from '../../shared/identifier.util';

@Injectable()
export class UserService implements IUserService {

    constructor(
        @InjectRepository(UserEntity) private userModel: Repository<UserEntity>,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.userModel.find()
    }

    async getAllEnabledUsers(): Promise<User[]> {
        return await this.userModel.find({enabled: true}).exists('dateOfDeactivation')
    }

    async findUserById(_id: string): Promise<User | null> {
        const user = await this.userModel.findById(_id)
        return user;
    }

    async findUserByIdentifier(identifier: string): Promise<User | null> {
      const user = await this.userModel.findOne({identifier})
      return user;
    }

    async findUserByEmail(email): Promise<User | null> {
        return await this.userModel.findOne({email: email})
    }

    async findUsersByRolesAndLang(user: UserDto): Promise<User[]> {
      return await this.userModel.find({lang: user.lang, roles: { $in: user.roles }})
    }

    async findUsersByRolesLangAndUnsubscribeEmail(user: UserDto): Promise<User[]> {
      return await this.userModel.find({lang: user.lang, roles: { $in: user.roles }, $or: [ { unsubscribeEmail: false }, { unsubscribeEmail: null } ]})
    }

    async createUser(user: UserDto): Promise<User> {
        const createUser = await this.userModel(user);
        return createUser.save();
    }

    async updateUser(_id: string, user: UserDto): Promise<User | null> {
        const updateUser = await this.userModel.findByIdAndUpdate(_id, user, { new: true });
        return updateUser;
    }

    async changeUserPassword(_id: string, oldPassword: string, newPassword: string): Promise<User | null> {
        const userToUpdate = await this.userModel.findById(_id)
        if (bcrypt.compareSync(oldPassword, userToUpdate.password) && !(newPassword.length < 10 || !newPassword.match(/[A-Z]+/g) || !newPassword.match(/[a-z]+/g) || !newPassword.match(/[\d]+/g))) {
            const updateUser = await this.userModel.findByIdAndUpdate(_id, {password: newPassword}, { new: true });
            return updateUser;
        } else {
            throw new WrongPasswordException({
                message: `Wrong password`,
                error: `5`,
            });
        }
    }

    async deleteUser(_id: string): Promise<any> {
        const deletedUser = await this.userModel.findByIdAndRemove(_id);
        return deletedUser;
    }

    async disableUser(_id: string) {
        const disabledUser = await this.userModel.findByIdAndUpdate(_id, { dateOfDeactivation: Date.now() }, { new: true });
        return disabledUser;
    }

    async activateUser(_id: string) {
        const disabledUser = await this.userModel.findByIdAndUpdate(_id, { enabled: true, dateOfDeactivation: null }, { new: true });
        return disabledUser;
    }

    async updateUserLangById(_id: string, lang: string): Promise<User | null> {
      return await this.userModel.findByIdAndUpdate( {_id}, { $set: { lang } }, {new: true } );
    }

    async unsubscribeFromEmail(_id: string, value: boolean): Promise<User | null> {
      return await this.userModel.findByIdAndUpdate( {_id}, { $set: { unsubscribeEmail: value } }, {new: true } );
    }

    async getUnsubscribeStatusById(_id: string): Promise<boolean> {
        const user = await this.findUserById(_id);
        return user?.unsubscribeEmail;
    }

    async regenerateUsersPassword(user: User): Promise<string> {
        const newPassword = PasswordUtil.customPassword();
        user.password = newPassword;
        user.token = null;
        await this.userModel.findByIdAndUpdate(user._id, user, {new: true});
        return newPassword;
    }

    async generateAndAssignRestoringToken(user: User): Promise<string> {
        let generatedToken = null;
        user.restoringTokenCreateDate = new Date();
        let userByRestoringToken = user;
        while (userByRestoringToken !== null) {
            generatedToken = uuid();
            userByRestoringToken = await this.userModel.findOne({restoringToken: generatedToken});
        }
        user.restoringToken = generatedToken;
        await this.userModel.findByIdAndUpdate(user._id, {restoringToken: user.restoringToken, restoringTokenCreateDate: user.restoringTokenCreateDate}, {new: true});
        return user.restoringToken;
    }

    async generateAndAssignEmailToken(user: User): Promise<string> {
      let generatedToken = null;
      let userByEmailToken = user;
      while (userByEmailToken !== null) {
        generatedToken = uuid();
        userByEmailToken = await this.userModel.findOne({emailToken: generatedToken});
      }
      user.emailToken = generatedToken;
      const updatedUser = await this.userModel.findByIdAndUpdate(user._id, {emailToken: user.emailToken}, {new: true});
      return updatedUser?.emailToken;
    }

    async findUserByRestoringToken(restoringToken: string) {
        const userByRestoringToken = await this.userModel.findOne({restoringToken});
        if (userByRestoringToken) {
            const restoringTokenCreateDate = userByRestoringToken.restoringTokenCreateDate;
            // one hour restoring tiken lifetime
            if (restoringTokenCreateDate.getTime() < new Date().getTime() - 60 * 60 * 1000) {
                throw new RestoringTokenExpiredException({
                    message: `Restoring token ${restoringToken} expired`,
                    error: `3`,
                });
            }
            return userByRestoringToken;
        }
        throw new NotFoundException({
            message: `Restoring token ${restoringToken} not found`,
            error: `4`,
        });
    }

    async findUserByUserToken(emailToken: string) {
        return await this.userModel.findOneAndUpdate({emailToken}, { $set: { unsubscribeEmail: true } }, {new: true });
    }

    async clearRestoringToken(_id: any) {
        const user = await this.userModel.findByIdAndUpdate(_id, {restoringToken: null, restoringTokenCreateDate: null}, { new: true });
        return user;
    }

    async generateIdentifier() {
        const identifier = IdentifierUtil.generateID();
        const createdUser = await this.findUserByIdentifier(identifier);
        if (createdUser) {
          return this.generateIdentifier();
        } else {
          return identifier;
        }
    }
}
