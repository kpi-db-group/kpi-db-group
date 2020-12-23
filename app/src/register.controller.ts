import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Res,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'winston';
import { HospitalService } from './hospital/service/hospital.service';
import { HospitalDto } from './hospital/hospital.dto';
import { PatientService } from './patient/patient/service/patient.service';
import { PatientDto } from './patient/patient/patient.dto';
import { SpecialistService } from './specialist/specialist/service/specialist.service';
import { SpecialistDto } from './specialist/specialist/specialist.dto';
import { ApiResponse, ApiImplicitBody, ApiUseTags, ApiResponseModelProperty, ApiOperation } from '@nestjs/swagger';
import {GetSpecialist} from './specialist/specialist/getSpecialist.interface';
import {Specialist} from './specialist/specialist/specialist.interface';

@ApiUseTags('Register')
@Controller('register')
export class RegisterController {

	constructor(
		@Inject('winston') private readonly logger: Logger,
		private readonly hospitalService: HospitalService,
		private readonly patienService: PatientService,
		private readonly specialistService: SpecialistService
	) {}

  @Post('clinic')
	@ApiResponse({ status: HttpStatus.CREATED, description: 'The clinic has been successfully created.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Forbidden.', type: ApiException })
  async registerClinic(@Body() hospital: HospitalDto) {
	this.logger.log({
		level: 'info',
		message: 'Register clinic request',
	});
    return await this.hospitalService.createHospitalNew(hospital);
	}

	@Post('patient')
	@ApiResponse({ status: HttpStatus.CREATED, description: 'The patient has been successfully created.'})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Forbidden.', type: ApiException })
  async registerPatient(@Body() patient: PatientDto) {
	this.logger.log({
		level: 'info',
		message: 'Register patient request',
	});
    return await this.patienService.createPatientNew(patient);
	}

	@Post('specialist')
	@ApiResponse({ status: HttpStatus.CREATED, description: 'The specialist has been successfully created.'/*, type: Specialist */})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Forbidden.', type: ApiException })
  async createSpecialist(@Body() specialist: SpecialistDto): Promise<Specialist> {
	this.logger.log({
		level: 'info',
		message: 'Register specialist request',
	});
    return await this.specialistService.createSpecialistNew(specialist);
  }
}
