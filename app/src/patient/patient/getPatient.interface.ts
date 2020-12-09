import { User } from '../../user/user.interface';
import { Hospital } from '../../hospital/hospital.interface';
import { GetSpecialist } from '../../specialist/specialist/getSpecialist.interface';

export interface GetPatient {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly secondaryName: string;
  readonly dateOfBirth: Date;
  readonly gender: string;
  readonly dateOfRegistration: Date;
  readonly dateOfWritingOut: Date;
  readonly medicalHistory: string;
  readonly goalRehabilitation: string;
  readonly hospital: Hospital;
  readonly user: User;
  readonly patientStatus: string;
  readonly height: number;
  readonly weight: number;
  readonly phoneNumber: string;
  readonly city: string;
  readonly address: string;
  readonly specialists: GetSpecialist[];
  readonly firstLogin: boolean;
  readonly nickname: string;
  readonly firstTimeAddGame: boolean;
}