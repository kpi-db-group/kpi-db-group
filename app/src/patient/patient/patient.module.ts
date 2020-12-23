import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRepository } from './patient.schema';
import { PatientService } from './service/patient.service';
import { PatientResolver } from './graphql/patient.resolver';
import { SpecialistModule } from '../../specialist/specialist/specialist.module';
import { UserModule } from '../../user/user.module';
import { WritingOutPatientScheduleService } from './writingOutPatientSchedule.service';
import { ScheduleModule } from 'nest-schedule';
import {HospitalModule} from '../../hospital/hospital.module';
import { EmailModule } from '../../email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PatientRepository]),
        SpecialistModule,
        HospitalModule,
        UserModule,
        EmailModule,
        ScheduleModule.register(),
    ],
    exports: [PatientService],
    providers: [PatientService, PatientResolver, WritingOutPatientScheduleService],
})
export class PatientModule {}
