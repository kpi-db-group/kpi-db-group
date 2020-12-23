import {Role} from '../../user/user.dto';

export interface JwtPayload {
  email: string;
  id: string;
  firstName?: string;
  lastName?: string;
  roles: Role[];
  limitedAccess: boolean;
  identifier: string;
}

export interface HospitalUserPayload extends JwtPayload {
  clinic: string;
}

export interface SpecialistUserPayload extends HospitalUserPayload {
  specialist: string;
}

export interface PatientUserPayload extends HospitalUserPayload {
  patient: string;
}

export interface PatientLidUserPayload extends JwtPayload {
  patientLid: string;
}
