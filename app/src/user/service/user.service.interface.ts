import { User } from '../user.interface';
import { UserDto } from '../user.dto';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getAllEnabledUsers(): Promise<User[]>;
  findUserById(_id: string): Promise<User | null>;
  findUserByIdentifier(identifier: string): Promise<User | null>;
  findUserByEmail(login): Promise<User | null>;
  createUser(user: UserDto): Promise<User>;
  updateUser(_id: string, user: UserDto): Promise<User | null>;
  changeUserPassword(_id: string, oldPassword: string, newPassword: string): Promise<User | null>;
  deleteUser(_id: string): Promise<string>;
  disableUser(_id: string): Promise<User>;
  activateUser(_id: string): Promise<User>;
  updateUserLangById(_id: string, lang: string): Promise<User | null>;
  unsubscribeFromEmail(_id: string, value: boolean): Promise<User | null>;
  getUnsubscribeStatusById(_id: string): Promise<boolean>;
  regenerateUsersPassword(user: User): Promise<string>;
  changeUserPassword(_id: string, oldPassword: string, newPassword: string): Promise<User | null>;
}
