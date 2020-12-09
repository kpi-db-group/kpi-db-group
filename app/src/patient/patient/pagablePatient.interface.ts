import { GetPatient } from './getPatient.interface';

export interface PagablePatients {
    readonly data: GetPatient[];
    readonly count: number;
}