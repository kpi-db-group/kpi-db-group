export interface Patient {
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
  readonly hospital: string;
  readonly user: string;
  readonly patientStatus: string;
  readonly height: number;
  readonly weight: number;
  readonly phoneNumber: string;
  readonly city: string;
  readonly address: string;
  readonly patientDiagnosis: string;
  readonly specialists: string[];
  readonly firstLogin: boolean;
  readonly nickname: string;
  readonly firstTimeAddGame: boolean;
}
