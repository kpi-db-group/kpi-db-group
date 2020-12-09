import { Patient } from '../patient.interface';
import { PatientDto } from '../patient.dto';
import { GetPatient } from '../getPatient.interface';
import { PagablePatients } from '../pagablePatient.interface';
import {JwtPayload} from '../../../auth/interfaces/jwt.payload.interface';

export interface IPatientService {
  getAllPatients(): Promise<GetPatient[]>;
  findPatientById(_id: string): Promise<GetPatient | null>;
  findPatientsByHospitalId(_id: string, index: number, elementsPerChunk: number, field: string, order: number, populatedEntity: string, populatedField: string): Promise<PagablePatients>;
  findPatientsBySpecialistId(_id: string, index: number, elementsPerChunk: number, field: string, order: number, populatedEntity: string, populatedField: string, active: boolean): Promise<PagablePatients>;
  findPatientByUserId(_id: string)
  createPatient(patient: PatientDto): Promise<Patient>;
  updatePatient(_id: string, patient: PatientDto, currentUser: JwtPayload, sendDownloadLink: boolean): Promise<Patient | null>;
  removeSpecialistFromPatients(specialistId: string, hospitalId: string);
  removeSpecialistFromPatient(specialistId: string, patientId: string);
  addSpecialistAndPatientConnections(specialistId: string, patientId: string);
}