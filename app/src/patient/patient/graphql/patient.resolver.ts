import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PatientService } from '../service/patient.service';
import { PatientDto } from '../patient.dto';
import { SpecialistService } from '../../../specialist/specialist/service/specialist.service';
import {HttpException, HttpStatus, Logger, UseGuards} from '@nestjs/common';
import {User as CurrentUser} from '../../../shared/user.decorator';
import {JwtPayload} from '../../../auth/interfaces/jwt.payload.interface';
import {AuthGuard} from '../../../user/guard/auth.guard';
import {HospitalService} from '../../../hospital/service/hospital.service';
import {Role} from '../../../user/user.dto';
import isEmptyObject from 'graphql-tools/dist/isEmptyObject';
import {RolesGuard} from '../../../user/guard/roles.guard';
import {Roles} from '../../../shared/roles.decorator';

@Resolver('Patient')
export class PatientResolver {
  constructor
  (
    private patientService: PatientService,
    private specialistService: SpecialistService,
    // private historyService: HistoryService,
    private hospitalService: HospitalService,
  ){}

  @Query()
  async getAllPatients() {
    return this.patientService.getAllPatients();
  }

  @Query()
  async getPatientById(@Args('_id') _id: string) {
    return this.patientService.findPatientById(_id);
  }

  @Query()
  async getPatientsByHospitalId(
    @Args('_idHospital') _idHospital: string,
    @Args('elementsPerChunk') elementsPerChunk: number,
    @Args('index') index: number,
    @Args('order') order: number,
    @Args('field') field: string,
    @Args('populatedEntity') populatedEntity: string,
    @Args('populatedField') populatedField: string) {
    return this.patientService.findPatientsByHospitalId(_idHospita, index, elementsPerChunk, field, order, populatedEntity, populatedField);
  }

  @Query()
  async getPatientsBySpecialistId(
    @Args('specialistId') specialistId: string,
    @Args('index') index: number,
    @Args('elementsPerChunk') elementsPerChunk: number,
    @Args('field') field: string,
    @Args('order') order: number,
    @Args('populatedEntity') populatedEntity: string,
    @Args('populatedField') populatedField: string,
    @Args('active') active: boolean) {
    return this.patientService.findPatientsBySpecialistId(specialistId, index, elementsPerChunk, field, order, populatedEntity, populatedField, active);
  }

  @Mutation()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SPECIALIST')
  async createPatient(
    @CurrentUser() currentUser: JwtPayload,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('secondaryName') secondaryName: string,
    @Args('dateOfBirth') dateOfBirth: Date,
    @Args('gender') gender: string,
    @Args('dateOfRegistration') dateOfRegistration: Date,
    @Args('dateOfWritingOut') dateOfWritingOut: Date,
    @Args('medicalHistory') medicalHistory: string,
    @Args('goalRehabilitation') goalRehabilitation: string,
    @Args('hospital') hospital: string,
    @Args('user') user: string,
    @Args('patientStatus') patientStatus: string,
    @Args('height') height: number,
    @Args('weight') weight: number,
    @Args('phoneNumber') phoneNumber: string,
    @Args('city') city: string,
    @Args('address') address: string,
    @Args('patientDiagnosis') patientDiagnosis: string,
    @Args('specialists') specialists: string[],
    @Args('email') email: string,
    @Args('firstLogin') firstLogin: boolean,
    @Args('nickname') nickname: string,
    @Args('firstTimeAddGame') firstTimeAddGame: boolean,
    @Args('lang') lang: string,
    @Args('appDownloaded') appDownloaded: boolean,
  ) {
      const date = new Date();
      if (email) {
          email = email.toLowerCase();
      }
      const patient: PatientDto = {firstName, lastName, secondaryName, dateOfBirth, gender, dateOfRegistration, dateOfWritingOut,
      medicalHistory, goalRehabilitation, hospital, user, patientStatus, height, weight, phoneNumber, city, address, patientDiagnosis,
      specialists, email, firstLogin, nickname, firstTimeAddGame, lang};
      const createdPatient = await this.patientService.createPatient(patient);

      if (createdPatient) {
          if (currentUser) {
              const specialistByUserId = await this.specialistService.findSpecialistByUserId(currentUser.id);
              const specialist = specialistByUserId._id;
          } else {
              Logger.error( 'Cant write history, because currentUser is empty');
              const message = 'CurrentUser empty';
              throw new HttpException(message, HttpStatus.BAD_REQUEST);
          }
      }
      return createdPatient;
  }

  @Mutation()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLINIC')
  async removeSpecialistFromPatients(
    @Args('specialistId') specialistId: string,
    @Args('hospitalId') hospitalId: string) {
    return await this.patientService.removeSpecialistFromPatients(ObjectId(specialistId), ObjectId(hospitalId));
  }

  @Mutation()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLINIC')
  async removeSpecialistFromPatient(
    @CurrentUser() currentUser: JwtPayload,
    @Args('specialistId') specialistId: string,
    @Args('patientId') patientId: string) {
    const removedSpecialist = await this.patientService.removeSpecialistFromPatient(ObjectId(specialistId), ObjectId(patientId));
    const date = new Date();

    if (currentUser) {
          const hospitalByUserId = await this.hospitalService.findHospitalByUserId(currentUser.id);
          const hospital = hospitalByUserId._id;
          const specialistById = await this.specialistService.findSpecialistById(specialistId);
      } else {
          Logger.error( 'Cant write history, because currentUser is empty');
          const message = 'CurrentUser empty';
          throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    return removedSpecialist;
  }

  @Mutation()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLINIC')
  async addSpecialistAndPatientConnections(
    @CurrentUser() currentUser: JwtPayload,
    @Args('specialistId') specialistId: string,
    @Args('patientId') patientId: string) {
      await this.patientService.addSpecialistAndPatientConnections(specialistId, ObjectId(patientId));
      await this.specialistService.addSpecialistAndPatientConnections(specialistId, patientId);
      const date = new Date();

      if (currentUser) {
              const hospitalByUserId = await this.hospitalService.findHospitalByUserId(currentUser.id);
              const hospital = hospitalByUserId._id;
            const specialistById = await this.specialistService.findSpecialistById(specialistId);
          } else {
              Logger.error( 'Cant write history, because currentUser is empty');
              const message = 'CurrentUser empty';
              throw new HttpException(message, HttpStatus.BAD_REQUEST);
          }
  }
}
