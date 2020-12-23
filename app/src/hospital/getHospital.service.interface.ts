import { User } from '../user/user.interface';

export interface GetHospital {
  readonly _id: string;
  readonly name: string;
  readonly city: string;
  readonly mainEmail: string;
  readonly additionalEmail: string;
  readonly user: User;  
}
