import { PATIENT_STATUS } from '../patient/patient.dto';
import { Entity, Column, OneToMany, OneToOne, BaseEntity, ManyToOne } from "typeorm";
import { UserEntity } from '../user/user.schema'
import { SpecialistEntity } from '../specialist/specialist.schema'

export class ExerciseSchema extends BaseEntity {
    @Column()
    name: string

    @Column()
    description: string

    @Column()
    link: string

    @Column()
    pictureLink: string

    @Column()
    gifLink: string

    @Column()
    lang: string

    @Column()
    forGames: string[]

    @Column()
    classifierId: string

    @Column()
    exerciseType: string

    @Column()
    commandRight: string

    @Column()
    commandLeft: string

    @OneToMany(_type => BodyPart)
    bodyPart: BodyPartEntity[]

    @Column()
    displayForPatient: boolean

    @Column()
    displayForSpecialist: boolean

    @OneToMany(_type => ExerciseTranslation)
    translation: ExerciseTranslationEntity[]


    @OneToMany(_type => Specialist)
    specialist: SpecialistEntity[]


    @OneToMany(_type => PhonePlacement)
    phonePlacement: PhonePlacementEntity[]

}