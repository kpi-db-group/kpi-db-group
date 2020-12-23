import { GetSpecialist } from './getSpecialist.interface';

export interface PagableSpecialists {
    readonly data: GetSpecialist[],
    readonly count: number
}