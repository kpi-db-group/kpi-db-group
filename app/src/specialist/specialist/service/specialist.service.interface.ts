import { Specialist } from '../specialist.interface';
import { SpecialistDto } from '../specialist.dto';
import { GetSpecialist } from '../getSpecialist.interface';
import { PagableSpecialists } from '../pagableSpecialist.interface';

export interface ISpecialistService {
  getAllSpecialists(): Promise<GetSpecialist[]>;
  findSpecialistById(_id: string): Promise<GetSpecialist | null>;
  findSpecialistByUserId(_id: string): Promise<Specialist | null>;
  findSpecialistsByHospital(_idHospital: string, index: number, elementsPerChunk: number, field: string, order: number, populatedField: string): Promise<PagableSpecialists>;
  findAllSpecialistsByStatus(status: string): Promise<GetSpecialist[]>;
  createSpecialist(specialistDto: SpecialistDto): Promise<Specialist>;
  updateSpecialist(_id: string, specialist: SpecialistDto, sendDownloadLink: boolean): Promise<Specialist | null>;
  deleteSpecialist(_id: string): Promise<string>;
  addSpecialistAndPatientConnections(specialistId: string, patientId: string);
}
