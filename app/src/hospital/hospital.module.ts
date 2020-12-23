import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HospitalRepository} from './hospital.schema';
import {HospitalService} from './service/hospital.service';
import {HospitalResolver} from './graphql/hospital.resolver';
import {UserModule} from '../user/user.module';
import { EmailModule } from '../email/email.module';
import {SpecialistRepository} from '../specialist/specialist/specialist.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([HospitalRepository]),
        TypeOrmModule.forFeature([SpecialistRepository]),
        UserModule,
        EmailModule,
    ],
    exports: [HospitalService],
    providers: [HospitalService, HospitalResolver],
})
export class HospitalModule {}