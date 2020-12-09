import { Injectable, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import {IHospitalService} from './hospital.service.interface';
import {HospitalDto} from '../hospital.dto';
import {Hospital} from '../hospital.interface';
import { InjectRepository } from '@nestjs/typeorm';
import {GetHospital} from '../getHospital.service.interface';
import {UserService} from '../../user/service/user.service';
import {Role, UserDto} from '../../user/user.dto';
import {MailerService} from '@nest-modules/mailer';
import {PasswordUtil} from '../../shared/password.util';
import { Logger } from 'winston';
import { ServiceEmailDto } from '../../email/serviceEmail.dto';
import { MailParams } from '../../email/mailParams';
import { EmailService } from '../../email/service/email.service';
import { SERVICE_NAME } from '../../email/email.dto';
import { Specialist } from '../../specialist/specialist/specialist.interface';
import { InviteUser } from '../inviteUser.interface';
import { CustomNodeJsGlobal } from '../../shared/custom.interface';
declare const global: CustomNodeJsGlobal;
import { Repository } from 'typeorm';

@Injectable()
export class HospitalService implements IHospitalService {

    constructor(
      @InjectRepository(HospitalEntity) private hospitalModel: Repository<HospitalEntity>,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private mailerService: MailerService,
        @Inject(forwardRef(() => EmailService))
        private emailService: EmailService,
        @Inject('winston') private readonly logger: Logger,
        @InjectRepository(SpecialistEntity) private specialistModel: Repository<SpecialistEntity>,
        @Inject(forwardRef(() => CalculationService))
    ) {}

    async getAllHospitals(): Promise<GetHospital[]> {
        const hospitals = await this.hospitalModel.find()
        this.logger.log({
            level: 'info',
            message: 'Get all hospitals request',
        });
        return hospitals;
    }

    async getAllHospitalsByStatus(usersIDs: string[], hospitalStatus: string): Promise<GetHospital[]> {
      const hospitals = await this.hospitalModel.find({user: { $in: usersIDs }, hospitalStatus})
      this.logger.log({
        level: 'info',
        message: `Get All Hospitals By Status ${hospitalStatus}`,
      });
      return hospitals;
    }

    async findHospitalById(_id: string): Promise<GetHospital | null> {
        const hospital = await this.hospitalModel.findById(_id)
        this.logger.log({
            level: 'info',
            message: 'Get hospital by id request',
        });
        return hospital;
    }

    async findHospitalByUserId(_id: string): Promise<Hospital | null> {
        const hospitalByUserId = await this.hospitalModel.findOne({user: _id});
        this.logger.log({
            level: 'info',
            message: 'Get hospital by user id request',
        });
        return hospitalByUserId;
    }

    async inviteUser(email: string, hospitalId: string, specialistId: string): Promise<InviteUser | null> {
      const createdUser = await this.userService.findUserByEmail(email);
      if (!createdUser) {
        let userName: string = '';
        let lang: string = '';
        let inviteQuery = global.config.network.REGISTER_APP_PROTOCOL + '://' + global.config.network.HOST;
        if (hospitalId && specialistId) {
          const specialist = await this.specialistModel.findById(specialistId)
          userName = `${specialist.firstName} ${specialist.lastName}`;
          lang = specialist.user.lang;
          inviteQuery += '?clinicId=' + hospitalId + '&specialistId=' + specialistId + '&email=' + email + '&lang=' + lang;
        } else {
          const hospital =  await this.findHospitalById(hospitalId);
          userName = hospital.name;
          lang = hospital.user.lang;
          inviteQuery += `?clinicId=${hospitalId}`+ `&email=${email}` + `&lang=${lang}`;
        }
        this.logger.log({
          level: 'info',
          message: 'Invite user request',
        });
        const templParams = new Map();
        templParams.set('userName', userName);
        templParams.set('inviteQuery', inviteQuery)
        const mailParams: MailParams = {
          successMessage: `Invitation email successfully sent`,
          failMessage: `Could not send invitation email`,
          replaceParams: templParams,
        };
        const serviceEmailDto: ServiceEmailDto = {
          recipient: email,
          mailParams: mailParams,
          serviceName: SERVICE_NAME.INVITE_NEW_USER_V2,
          lang: lang,
          sendDownloadLink: false,
        };
        this.emailService.sendServiceEmailToRecipient(serviceEmailDto);
        return {status: "SUCCESS"};
      } else {
        throw new InternalServerErrorException({
          message: [`${createdUser.roles[0]}`, `${email}`, `This email is already registered`],
          error: `0`,
        });
      }
    }

    async createHospital(hospital: HospitalDto): Promise<Hospital> {
        if (hospital.mainEmail) {
            hospital.mainEmail = hospital.mainEmail.toLowerCase();
        }
        if (hospital.additionalEmail) {
            hospital.additionalEmail = hospital.additionalEmail.toLowerCase();
        }
        const createdUser = await this.userService.findUserByEmail(hospital.mainEmail);
        if (!createdUser) {
            const newPassword = PasswordUtil.customPassword();
            const identifier = await this.userService.generateIdentifier();
            // @ts-ignore
            const user: UserDto = {password: newPassword, email: hospital.mainEmail, roles: [Role[Role.CLINIC]], identifier, lang: hospital.lang};
            const newClinicUser = await this.userService.createUser(user);
            this.logger.log({
                level: 'info',
                message: 'Create new hospital user request',
            });
            const createHospital = await this.hospitalModel({
                name: hospital.name,
                city: hospital.city,
                mainEmail: hospital.mainEmail,
                additionalEmail: hospital.additionalEmail,
                hospitalStatus: hospital.hospitalStatus,
                country: hospital.country,
                user: [newClinicUser._id],
            });
            const newHospital = await createHospital.save();
            this.logger.log({
                level: 'info',
                message: 'Create new hospital request',
            });
            if (newHospital) {
              const templParams = new Map();
              templParams.set('hospitalName', hospital.name);
              templParams.set('mainEmail', hospital.mainEmail);
              templParams.set('newPassword', newPassword);
              const mailParams: MailParams = {
                successMessage: `Mail with new clinic: ${hospital.name} successfully sent`,
                failMessage: `Could not send email new clinic: ${hospital.name}`,
                replaceParams: templParams,
              };
              const serviceEmailDto: ServiceEmailDto = {
                recipient: hospital.mainEmail,
                mailParams: mailParams,
                serviceName: SERVICE_NAME.CREATE_CLINIC_NEW,
                lang: hospital.lang,
                sendDownloadLink: true,
              };
              this.emailService.sendServiceEmailToRecipient(serviceEmailDto);
              return newHospital;
            } else {
              throw new InternalServerErrorException({
                message: `Error while creating hospital: ${hospital.mainEmail}`,
                error: `0`,
              });
            }
        } else {
            throw new InternalServerErrorException({
                message: `User with ${hospital.mainEmail} already exist`,
                error: `0`,
            });
        }
    }

    async updateHospital(_id: string, hospitalDto: HospitalDto, sendDownloadLink: boolean): Promise<Hospital | null> {
        // TODO make logic for change login for clinic user in user entity
        if (hospitalDto.additionalEmail) {
            hospitalDto.additionalEmail = hospitalDto.additionalEmail.toLowerCase();
        }
        if (hospitalDto.mainEmail) {
            hospitalDto.mainEmail = hospitalDto.mainEmail.toLowerCase();
            let isEmailBelongsToUserByHospitalId: boolean;
            let hospitalsOldMainEmail = '';
            await this.hospitalModel.findById(_id).then(createdHospital => {
                hospitalsOldMainEmail = createdHospital.mainEmail;
                if (createdHospital.mainEmail === hospitalDto.mainEmail)  {
                    isEmailBelongsToUserByHospitalId = true;
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
            if (isEmailBelongsToUserByHospitalId) {
                return await this.hospitalModel.findByIdAndUpdate(_id, hospitalDto, { new: true });
            } else {
                const createdUser = await this.userService.findUserByEmail(hospitalDto.mainEmail);
                const oldUser = await this.userService.findUserByEmail(hospitalsOldMainEmail);
                if (!createdUser && oldUser) {
                    const updatedUser = await this.userService.updateUser(oldUser._id,
                      {email: hospitalDto.mainEmail, token: null, lang: oldUser?.lang || 'en'});
                    if (updatedUser) {
                      const updatedHospital = await this.hospitalModel.findByIdAndUpdate(_id, hospitalDto, { new: true });
                      if (updatedHospital) {
                          const templParams = new Map();
                          templParams.set('hospitalName', hospitalDto.name);
                          templParams.set('mainEmail', hospitalDto.mainEmail);
                          const mailParams: MailParams = {
                            successMessage: `Mail with new clinic ${hospitalDto.mainEmail} successfully sent`,
                            failMessage: `Could not send email for clinic: ${hospitalDto.mainEmail}`,
                            replaceParams: templParams,
                          };
                          const serviceEmailDto: ServiceEmailDto = {
                            recipient: hospitalDto.mainEmail,
                            mailParams: mailParams,
                            serviceName: SERVICE_NAME.UPDATE_CLINIC,
                            lang: updatedUser.lang,
                            sendDownloadLink: sendDownloadLink,
                          };
                          this.emailService.sendServiceEmailToRecipient(serviceEmailDto);
                          this.logger.log({
                            level: 'info',
                            message: 'Update hospital request',
                          });
                          return updatedHospital;
                      } else {
                        throw new InternalServerErrorException({
                          message: `Error while updating hospital: ${hospitalDto.mainEmail}`,
                          error: `0`,
                        });
                      }
                    } else {
                      throw new InternalServerErrorException({
                        message: `Error while updating user: ${hospitalDto.mainEmail}`,
                        error: `0`,
                      });
                    }
                } else {
                    throw new InternalServerErrorException({
                        message: `User with ${hospitalDto.mainEmail} already exist`,
                        error: `0`,
                    });
                }
            }
        }
        return await this.hospitalModel.findByIdAndUpdate(_id, hospitalDto, { new: true });
    }

    async deleteHospital(_id: string): Promise<any> {
        const deletedHospital = await this.hospitalModel.findByIdAndRemove(_id);
        this.logger.log({
            level: 'info',
            message: 'Delete hospital request',
        });
        return deletedHospital;
    }
}
