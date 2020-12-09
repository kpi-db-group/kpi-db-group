import { Injectable, Logger } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { SpecialistService } from './service/specialist.service';
import { PatientService } from '../../patient/patient/service/patient.service';
import { UserService } from '../../user/service/user.service';
import { ModuleRef } from '@nestjs/core';
import { SPECIALIST_STATUS } from './specialist.dto'

@Injectable()
export class FiringSpecialistScheduleService extends NestSchedule {
  private patientService: PatientService;
  private userService: UserService;

  constructor(private specialistService: SpecialistService,  private readonly moduleRef: ModuleRef) {
    super();
    this.patientService = this.moduleRef.get(PatientService, { strict: false });
    this.userService = this.moduleRef.get(UserService,  { strict: false });
  }

  @Cron('* * * * *', {key: 'specialist'})
  async cronJob() {
    await this.specialistService.getAllSpecialists().then(
      specialists => {
        specialists.forEach((specialist) => {
          if (specialist.dateOfFiring) {
            if (specialist.specialistStatus === SPECIALIST_STATUS.WORKS && +new Date(specialist.dateOfFiring) < Date.now()) {
                if (specialist.patients) {
                  specialist.patients.forEach(patient => {
                    if(patient.specialists) {
                        const updatedSpecialists = patient.specialists.filter(s => s._id.toString() !== specialist._id.toString()).map(s => s._id); //TODO: use equals
                        this.patientService.updatePatient(patient._id, {specialists: updatedSpecialists}, null, false);
                        Logger.debug(`Updated patient ${patient.firstName} ${patient.lastName} with specialists ${updatedSpecialists}`);
                    }
                  });
                }
                this.userService.updateUser(specialist.user._id.toString(), {limitedAccess: true, token: null});
                this.specialistService.updateSpecialist(specialist._id, {specialistStatus: SPECIALIST_STATUS.FIRED, patients: []}, false);
                Logger.debug(`Specialist ${specialist.firstName} ${specialist.lastName} was fired`);
            }
          }
        });
      },
      error => console.log("Rejected: " + error)
    ).catch((err) => {
      Logger.error(`An error occurred while dismissing a specialist`);
      Logger.error(err);
    });
    await await this.specialistService.getAllSpecialists().then(
      specialists => {
        specialists.forEach((specialist) => {
          if (specialist.dateOfHiring) {
            if (specialist.specialistStatus === SPECIALIST_STATUS.NOT_START && +new Date(specialist.dateOfHiring) < Date.now()) {
              this.specialistService.updateSpecialist(specialist._id, {specialistStatus: SPECIALIST_STATUS.WORKS}, false);
              Logger.debug(`Specialist ${specialist.firstName} ${specialist.lastName} began to work`);
            }
          }
        });
      }
    ).catch((err) => {
      Logger.error(`An error occurred while enrolling a specialist for a job`);
      Logger.error(err);
    });
  }
}