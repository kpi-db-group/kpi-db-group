import { Hospital } from '../hospital.interface';
import { HospitalDto } from '../hospital.dto';
import { GetHospital } from '../getHospital.service.interface';
import { InviteUser } from '../inviteUser.interface';

export interface IHospitalService {
  getAllHospitals(): Promise<GetHospital[]>;
  findHospitalById(_id: string): Promise<GetHospital | null>;
  inviteUser(email: string, hospitalId: string, specialistId: string): Promise<InviteUser | null>;
  createHospital(hospital: HospitalDto): Promise<Hospital>;
  updateHospital(_id: string, hospital: HospitalDto, sendDownloadLink: boolean): Promise<Hospital | null>;
  deleteHospital(_id: string): Promise<string>;
  findHospitalByUserId(_id: string): Promise<Hospital | null>;
}
