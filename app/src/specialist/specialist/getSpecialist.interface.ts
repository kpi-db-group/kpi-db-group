import { Hospital } from '../../hospital/hospital.interface';
import { User } from '../../user/user.interface';
import { GetPatient } from '../../patient/patient/getPatient.interface';

export interface GetSpecialist {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly secondaryName: string;
  readonly dateOfBirth: Date;
  readonly dateOfHiring: Date;
  readonly dateOfFiring: Date;
  readonly experience: string;
  readonly email: string;
  readonly about: string;
  readonly gender: string;
  readonly address: string;
  readonly phoneNumber: string;
  readonly city: string;
  readonly specialistStatus: string;
  readonly patients: GetPatient[];
  readonly hospital: Hospital;
  readonly user: User;
  readonly readonly: boolean;
}
