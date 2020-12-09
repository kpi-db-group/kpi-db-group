import { Entity, Column, OneToMany, OneToOne, JoinColumn, BaseEntity } from "typeorm";
import { SPECIALIST_STATUS } from './specialist.dto';
import { PatientEntity } from '../patient/patient/patient.schema'
import { UserEntity } from '../user/user.schema'

@Entity('specialists')
export class SpecialistEntity extends BaseEntity {
    @Column()
    firstName: string
    @Column()
    lastName: string
    @Column()
    secondaryName: string
    @Column()
    dateOfBirth: Date
    @Column()
    dateOfHiring: Date
    @Column()
    dateOfFiring: Date
    @Column()
    experience: string
    @Column()
    email: string
    @Column()
    about: string
    @Column()
    gender: string
    @Column()
    address: string
    @Column()
    phoneNumber: string
    @Column()
    city: string
    @Column()
    specialistStatus: {
        enum: [
          SPECIALIST_STATUS.NOT_START,
          SPECIALIST_STATUS.WORKS,
          SPECIALIST_STATUS.FIRED],
    }
    @OneToMany(_type => HospitalEntity)
    hospital: HospitalEntity[]
    @OneToMany(_type => PatientEntity)
    patient: PatientEntity[]
    @OneToMany(_type => UserEntity)
    user: UserEntity[]
}