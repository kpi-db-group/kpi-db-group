import {Role} from '../user/user.dto';

export class AuthDto {
  readonly login: string;
  readonly password: string;
  readonly role: Role;
  readonly rememberMe: boolean;
  readonly lang: string;
}
