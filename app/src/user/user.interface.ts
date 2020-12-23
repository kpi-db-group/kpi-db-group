import {Role} from './user.dto';

export interface User {
  readonly _id: string;
  password: string;
  restoringToken: string;
  restoringTokenCreateDate: Date;
  wrongLoginAttemptsCycle: Date[];
  readonly email: string;
  readonly roles: Role[];
  token: string;
  limitedAccess: boolean;
  identifier: string;
  lang: string;
  unsubscribeEmail: boolean;
  emailToken: string;
  enabled: boolean,
  lastLoginDate: Date,
  firstLoginDate: Date,
  dateOfDeactivation: Date,
  createdAt: Date,
  updatedAt: Date,
  mark: string;
  markCreateDate: Date;
  checkPassword(password: string, cb: (err, isMatch) => void): void;
}
