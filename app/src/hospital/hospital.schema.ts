import { Entity, Column, OneToMany, OneToOne, JoinColumn, BaseEntity, ManyToOne } from "typeorm";
import { HOSPITAL_STATUS } from './hospital.dto'
// import { CardEntity } from '../card/card.schema'
// import { CountryEntity } from '../country/country.schema'
import { UserEntity } from '../user/user.schema'

@Entity('hospitals')
export class HospitalEntity extends BaseEntity {
    @Column()
    username: string
    @Column()
    city: string
    @Column()
    mainEmail
    @Column()
    additionalEmail: string
    @Column()
    hospitalStatus: {
        enum: [
          HOSPITAL_STATUS.ACTIVE,
          HOSPITAL_STATUS.ARREARS,
          HOSPITAL_STATUS.CLOSED],
    }
    @Column('boolean')
    newsAndUpdates: boolean

    @ManyToOne(
        _type => UserEntity ,
        user => user.hospitals,
        {onDelete:'CASCADE'}
      )
      user: UserEntity
    
      @Column()
      userId: string

    //   @ManyToOne(
    //     _type => CardEntity ,
    //     card => card.hospitals,
    //     {onDelete:'CASCADE'}
    //   )
    //   card: CardEntity
    
    //   @Column()
    //   cardId: string

    //   @ManyToOne(
    //     _type => CountryEntity ,
    //     country => country.hospitals,
    //     {onDelete:'CASCADE'}
    //   )
    //   country: CountryEntity
    
    //   @Column()
    //   countryId: string

}
