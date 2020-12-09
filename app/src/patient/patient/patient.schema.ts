import { PATIENT_STATUS } from './patient.dto';
import { Entity, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, ManyToOne } from "typeorm";
import { SpecialistEntity } from '../specialist/specialist.schema'
import { UserEntity } from '../user/user.schema'
import { HospitalEntity } from '../hospital/hospital.schema'

export class PatientEntity extends BaseEntity {
    @Column()
    firstName: string
    @Column()
    lastName: string

    @Column()
    secondaryName: string

    @Column()
    dateOfBirth: Date

    @Column()
    gender: string

    @Column()
    email: string

    @Column()
    dateOfRegistration: Date

    @Column()
    dateOfWritingOut: Date

    @Column()
    medicalHistory: string

    @Column()
    goalRehabilitation: string


    @OneToMany(_type => HospitalEntity)
    hospital: HospitalEntity[]

    @OneToMany(_type => UserEntity)
    user: UserEntity[]

    @Column()
    patientStatus: {
        type: string,
        require: false,
        enum: [
          PATIENT_STATUS.ACTIVE,
          PATIENT_STATUS.ACTIVE_WITHOUT_SPECIALIST,
          PATIENT_STATUS.DISCHARGED,
          PATIENT_STATUS.ARCHIVE,
        ],
    }

    @Column()
    height: number

    @Column()
    weight: number

    @Column()
    phoneNumber: number

    @Column()
    city: string

    @Column()
    address: string

    @ManyToOne(
        _type => SpecialistEntity ,
        specialist => specialist.patients,
        {onDelete:'CASCADE'}
      )
      specialist: SpecialistEntity
    
      @Column()
      specialistId: string

    @Column()
    nickname: string

    @Column()
    firstTimeAddGame: string
}
