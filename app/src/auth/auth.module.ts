import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtStrategy} from './strategies/jwt.strategy';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {AuthResolver} from './graphql/auth.resolver';
import {UserModule} from '../user/user.module';
import {SpecialistModule} from '../specialist/specialist/specialist.module';
import {HospitalModule} from '../hospital/hospital.module';
import {PatientModule} from '../patient/patient/patient.module';
import {PatientLidModule} from '../patient/patientLid/patientLid.module';
import {AuthController} from './auth.controller';
import { EmailModule } from '../email/email.module'
import { JwtConfigService } from '../jwt-config.service'

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt', session: false}),
        JwtModule.registerAsync({useClass: JwtConfigService}),
        UserModule,
        SpecialistModule,
        HospitalModule,
        PatientModule,
        EmailModule,
        PatientLidModule,
    ],
    providers: [AuthService, AuthResolver],
    controllers: [AuthController],
})
export class AuthModule {
}
