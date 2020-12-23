export interface Specialist {
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
  readonly specialistSpecialization: string;
  readonly specialistStatus: string;
  readonly patients: string[];
  readonly hospital: string;
  readonly user: string;
  readonly firstLogin: boolean;
}
