import {Role} from './user.dto';
import * as bcrypt from 'bcrypt';
import { HospitalEntity } from '../hospital/hospital.schema'
import {
    Entity,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
    BaseEntity,
    ManyToOne
} from "typeorm";

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column()
    password: string
    @Column()
    email: string
    @Column()
    wrongLoginAttemptsCycle: Date
    @Column()
    restoringToken: string
    restoringTokenCreateDate: Date
    @Column()
    token: string
    @Column()
    limitedAccess: Boolean
    @Column()
    identifier: string
    @Column()
    lang: string
    @Column()
    unsubscribeEmail: Boolean
    @Column()
    emailToken: string
    @Column()
    enabled: Boolean
    @Column()
    dateOfDeactivation: Date
    @Column()
    lastLoginDate: Date
    @Column()
    firstLoginDate: Date
    @Column()
    mark: string
    @Column()
    markCreateDate: Date
    @Column()
    roles: string

    @OneToMany(
        _type => HospitalEntity,
        hospital => hospital.user
      )
      hospitals: HospitalEntity[]

}