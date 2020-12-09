import {Injectable, InternalServerErrorException, forwardRef, Inject} from '@nestjs/common';
import {IPatientService} from './patient.service.interface';
import {Patient} from '../patient.interface';
import { PATIENT_STATUS, PatientDto } from '../patient.dto'
import {GetPatient} from '../getPatient.interface';
import {PagablePatients} from '../pagablePatient.interface';
import {Role, UserDto} from '../../../user/user.dto';
import {UserService} from '../../../user/service/user.service';
import {MailerService} from '@nest-modules/mailer';
import {PasswordUtil} from '../../../shared/password.util';
import {ThisExpression} from 'ts-morph';
import {SpecialistService} from '../../../specialist/specialist/service/specialist.service';
import {PaginationSortUtil} from '../../../shared/pagination-sorting.utils';
import {JwtPayload} from '../../../auth/interfaces/jwt.payload.interface';
import {HospitalService} from '../../../hospital/service/hospital.service';
import {Logger} from 'winston';
import { EmailService } from '../../../email/service/email.service';
import { MailParams } from '../../../email/mailParams';
import { ServiceEmailDto } from '../../../email/serviceEmail.dto';
import { SERVICE_NAME } from '../../../email/email.dto';
import { CustomNodeJsGlobal } from '../../../shared/custom.interface';
declare const global: CustomNodeJsGlobal;
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientService implements IPatientService {

    constructor(
        @InjectRepository(PatientEntity) private patientModel: Repository<PatientEntity>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private mailerService: MailerService,
        @Inject(forwardRef(() => SpecialistService))
        private specialistService: SpecialistService,
        private specialistSpecializationService: SpecialistSpecializationService,
        private hospitalService: HospitalService,
        @Inject(forwardRef(() => EmailService))
        private emailService: EmailService,
        @Inject('winston') private readonly logger: Logger,
    ) {
    }

    async getAllPatients(): Promise<GetPatient[]> {
        const patients = await this.patientModel.find()
        this.logger.log({
            level: 'info',
            message: 'Get all patients request',
        });
        return patients;
    }

    async getAllPatientsByStatus(usersIDs: string[], patientStatus: string): Promise<GetPatient[]> {
      const patients = await this.patientModel.find({user: { $in: usersIDs }, patientStatus})
      return patients;
    }

    async findPatientById(_id: string): Promise<GetPatient | null> {
        const patient = await this.patientModel.findById(_id)
        return patient;
    }

    async findPatientsByHospitalId(_idHospital: string, index: number, elementsPerChunk: number, field: string, order: number, populatedEntity: string, populatedField: string): Promise<PagablePatients> {
        const patients = await PaginationSortUtil.customQuery(this.patientModel.find({hospital: _idHospital}), {index, elementsPerChunk, field, order})
        PaginationSortUtil.sortPopulatedField(patients, populatedEntity, populatedField, order);
        this.logger.log({
            level: 'info',
            message: 'Get patients by hospital id request',
        });
        return  {data: patients, count: await this.patientModel.countDocuments({hospital: _idHospital})};
    }

    async findPatientsBySpecialistId(specialistId: string, index: number, elementsPerChunk: number, field: string, order: number, populatedEntity: string, populatedField: string, active: boolean): Promise<PagablePatients> {
        let optionsForFind = {};
        if (active) {
            optionsForFind = {specialists: specialistId, patientStatus: PATIENT_STATUS.ACTIVE};
        } else {
            optionsForFind = {specialists: specialistId};
        }
        const patients = await PaginationSortUtil.customQuery(this.patientModel.find(optionsForFind), {index, elementsPerChunk, field, order})
        PaginationSortUtil.sortPopulatedField(patients, populatedEntity, populatedField, order);
        this.logger.log({
            level: 'info',
            message: 'Get patients by specialist id request',
        });
        return  {data: patients, count: await this.patientModel.countDocuments(optionsForFind)};
    }

    async createPatientNew(patient: PatientDto): Promise<Patient> {
        if (patient.email) {
            patient.email = patient.email.toLowerCase();
        }
        const createdUser = await this.userService.findUserByEmail(patient.email);
        if (!createdUser) {
            // const newPassword = PasswordUtil.customPassword();
            const identifier = await this.userService.generateIdentifier();
            // @ts-ignore
            const user: UserDto = {password: patient.password, email: patient.email, roles: [Role[Role.PATIENT]], identifier, lang: patient.lang};
            const newPatientUser = await this.userService.createUser(user);
            this.logger.log({
                level: 'info',
                message: `New patient user created ${JSON.stringify(newPatientUser)}`,
            });
            if (!newPatientUser) {
                throw new InternalServerErrorException({
                    message: `Could not create user for patient ${JSON.stringify(patient)}`,
                    error: `0`,
                });
            }
            const createPatient = await this.patientModel({
                firstName: patient.firstName,
                lastName: patient.lastName,
                secondaryName: patient.secondaryName,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                dateOfRegistration: new Date(),
                dateOfWritingOut: patient.dateOfWritingOut,
                medicalHistory: patient.medicalHistory,
                goalRehabilitation: patient.goalRehabilitation,
                hospital: patient.hospital,
                user: newPatientUser._id,
                patientStatus: PATIENT_STATUS.ACTIVE,
                height: patient.height,
                weight: patient.weight,
                phoneNumber: patient.phoneNumber,
                city: patient.city,
                address: patient.address,
                patientDiagnosis: patient.patientDiagnosis,
                specialists: patient.specialists,
                email: patient.email,
                nickname: patient.nickname,
            });
            // Create achievement
            const newPatientLidAchievement = await this.patientLidAchievementModel();
            const createdPatientLidAchievement = await newPatientLidAchievement.save();
            if (createdPatientLidAchievement) {
                createPatient.achievement = createdPatientLidAchievement._id;
            }
            const savedPatient = await createPatient.save();
            if (savedPatient) {
                this.logger.log({
                    level: 'info',
                    message: 'Create patient request',
                });
                this.specialistService.addSpecialistAndPatientConnections(savedPatient.specialists[0], savedPatient._id);
                this.patientModel, () => {};
                return savedPatient;
            } else {
                throw new InternalServerErrorException({
                    message: `Could not create New patient ${JSON.stringify(patient)}`,
                    error: `0`,
                });
            }
        } else {
            throw new InternalServerErrorException({
                message: `User with ${patient.email} already exist`,
                email: patient.email,
                error: `0`,
            });
        }
    }

    async updatePatient(_id: string, patient: PatientDto, currentUser: JwtPayload, sendDownloadLink: boolean): Promise<Patient | null> {
        if (patient.email) {
            patient.email = patient.email.toLowerCase();
        }
        const patientById = await this.findPatientById(_id);
        if (patient.dateOfWritingOut) {
            let patientFirstName = '';
            let patientLastName = '';
            let specialisation = '';
            let specialistFirstName = '';
            let specialistLastName = '';
            let clinicName = '';
            let lang = '';
            const patientRecommendation = patient.recommendation || 'no recommendations for you.';
            if (patientById) {
                patientFirstName = patientById.firstName;
                patientLastName = patientById.lastName;
                lang = patientById.user?.lang;
            }
            if (currentUser) {
                const specialistByUserId = await this.specialistService.findSpecialistByUserId(currentUser.id);
                if (specialistByUserId) {
                    specialistFirstName = specialistByUserId.firstName;
                    specialistLastName = specialistByUserId.lastName;
                    if (specialistByUserId.specialistSpecialization) {
                        const specialistSpecializationById = await this.specialistSpecializationService.findSpecialistSpecializationById(specialistByUserId.specialistSpecialization);
                        specialisation = specialistSpecializationById.specialization;
                    }
                    if (specialistByUserId.hospital) {
                        const hospitalById = await this.hospitalService.findHospitalById(specialistByUserId.hospital);
                        clinicName = hospitalById.name;
                    }
                }
            }
            const templParams = new Map();
            templParams.set('patientFirstName', patientFirstName);
            templParams.set('patientLastName', patientLastName);
            templParams.set('specialisation', specialisation);
            templParams.set('specialistFirstName', specialistFirstName);
            templParams.set('specialistLastName', specialistLastName);
            templParams.set('clinicName', clinicName);
            templParams.set('patientRecommendation', patientRecommendation);
            const mailParams: MailParams = {
                successMessage: `Mail with recommendation to ${patient.email} successfully sent`,
                failMessage: `Could not send email for new patient ${patient.email}`,
                replaceParams: templParams,
              };
            const serviceEmailDto: ServiceEmailDto = {
                recipient: patient.email,
                mailParams: mailParams,
                serviceName: SERVICE_NAME.DISCHARGED_PATIENT,
                lang: lang,
              };
            this.emailService.sendServiceEmailToRecipient(serviceEmailDto);
        }
        if (+new Date(patient.dateOfWritingOut) < Date.now()) {
            let patientStatus;
            if (patientById) {
                if (patientById.firstLogin) {
                    patientStatus = PATIENT_STATUS.DISCHARGED;
                } else {
                    patientStatus = PATIENT_STATUS.ARCHIVE;
                }
                return await this.patientModel.findByIdAndUpdate(_id, {patientStatus, dateOfWritingOut: patient.dateOfWritingOut, patients: []}, {new: true});
            }
        }
        if (patient.email) {
            let isEmailBelongsToUserByPatientId: boolean;
            await this.patientModel.findById(_id).then(createdPatient => {
                if (createdPatient.email === patient.email)  {
                    isEmailBelongsToUserByPatientId = true;
                }
            }).catch(err => {
                this.logger.log({
                    level: 'error',
                    message: err,
                });
                throw new InternalServerErrorException({
                    message: err,
                    error: `0`,
                });
            });
            if (isEmailBelongsToUserByPatientId) {
                return this.patientModel.findByIdAndUpdate(_id, patient, {new: true});
            } else {
                const createdUser = await this.userService.findUserByEmail(patient.email);
                if (!createdUser) {
                    const updatedUser = await this.userService.updateUser(patient.user,
                      {email: patient.email, token: null, lang: patientById?.user?.lang || 'en'});
                    if (updatedUser) {
                      this.logger.log({
                        level: 'info',
                        message: 'Update patient request',
                      });
                      const templParams = new Map();
                      templParams.set('firstName', patient.firstName);
                      templParams.set('lastName', patient.lastName);
                      templParams.set('email', patient.email);
                      const mailParams: MailParams = {
                        successMessage: `Mail with new patient ${patient.email} successfully sent`,
                        failMessage: `Could not send email for new patient ${patient.email}`,
                        replaceParams: templParams,
                      };
                      const serviceEmailDto: ServiceEmailDto = {
                        recipient: patient.email,
                        mailParams: mailParams,
                        serviceName: SERVICE_NAME.UPDATED_PATIENT,
                        lang: updatedUser.lang,
                        sendDownloadLink: sendDownloadLink,
                      };
                      this.emailService.sendServiceEmailToRecipient(serviceEmailDto);
                      return await this.patientModel.findByIdAndUpdate(_id, patient, {new: true});
                    } else {
                      this.logger.log({
                        level: 'error',
                        message: `Error while updating email to user with id: ${patient.user}`,
                      });
                      throw new InternalServerErrorException({
                        message: `Error while updating email to user with id: ${patient.user}`,
                        error: `0`,
                      });
                    }
                } else {
                    this.logger.log({
                      level: 'error',
                      message: `User with ${patient.email} already exist`,
                    });
                    throw new InternalServerErrorException({
                        message: `User with ${patient.email} already exist`,
                        error: `0`,
                    });
                }
            }
        }
        return await this.patientModel.findByIdAndUpdate(_id, patient, {new: true});
    }

    async removeSpecialistFromPatients(specialistId: string, hospitalId: string) {
        const patients = await this.patientModel.find({specialists: specialistId, hospital: hospitalId});
        patients.forEach(patient => {
            const index = patient.specialists.indexOf(specialistId);
            patient.specialists.splice(index, 1);
            patient.save();
        });
        this.logger.log({
            level: 'info',
            message: 'Remove specialists from patients request',
        });
    }

    async removeSpecialistFromPatient(specialistId: string, patientId: string) {
        const patient = await this.patientModel.findById(patientId);
        const index = patient.specialists.indexOf(specialistId);
        patient.specialists.splice(index, 1);
        patient.save();
        this.specialistService.removePatientFromSpecialist(specialistId, patient.id);
        this.logger.log({
            level: 'info',
            message: 'Remove specialist from patient request',
        });
    }

    async addSpecialistAndPatientConnections(specialistId: string, patientId: string) {
        const patient = await this.patientModel.findById(patientId);
        if (!patient.specialists.includes(specialistId)) {
            patient.specialists.push(specialistId);
            patient.save();
        }
        this.logger.log({
            level: 'info',
            message: 'Add specialist and patient connection request',
        });
    }

    async changePatientStatus(_id: string, patientStatus): Promise<any> {
        const updatedPatient = await this.patientModel.findByIdAndUpdate(_id, {patientStatus}, {new: true});
        this.logger.log({
            level: 'info',
            message: 'Update patient status request',
        });
        return updatedPatient;
    }
}
