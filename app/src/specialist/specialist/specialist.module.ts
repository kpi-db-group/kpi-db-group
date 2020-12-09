import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SpecialistRepository} from './specialist.schema';
import {SpecialistService} from './service/specialist.service';
import {SpecialistResolver} from './graphql/specialist.resolver';
import {UserModule} from '../../user/user.module';
import {FiringSpecialistScheduleService} from './firingSpecialistSchedule.service';
import {ScheduleModule} from 'nest-schedule';
import { EmailModule } from '../../email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SpecialistRepository]),
        UserModule,
        EmailModule,
        ScheduleModule.register(),
    ],
    exports: [SpecialistService],
    providers: [
        SpecialistService,
        SpecialistResolver,
        FiringSpecialistScheduleService,
    ],
})
export class SpecialistModule {}
