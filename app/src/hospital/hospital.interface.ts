// import { HospitalStatus } from '../hospitalStatus/hospitalStatus.interface';
import { User } from '../user/user.interface';

export interface Hospital {
  readonly _id: string;
  readonly name: string;
  readonly city: string;
  readonly mainEmail: string;
  readonly additionalEmail: string;
  // readonly hospitalStatus: HospitalStatus;
  readonly country: string;
  readonly user: string;
  readonly newsAndUpdates: boolean;
}
