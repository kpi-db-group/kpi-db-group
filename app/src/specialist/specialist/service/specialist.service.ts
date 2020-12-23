import {Injectable, InternalServerErrorException, Inject, forwardRef} from '@nestjs/common';
import {ISpecialistService} from './specialist.service.interface';
import {Specialist} from '../specialist.interface';
import { SPECIALIST_STATUS, SpecialistDto } from '../specialist.dto';
import {GetSpecialist} from '../getSpecialist.interface';
import {UserService} from '../../../user/service/user.service';
import {Role, UserDto} from '../../../user/user.dto';
import {MailerService} from '@nest-modules/mailer';
import {UserAlreadyExistsException} from '../../../shared/excpetion/user-already-exists.exception';
import {PasswordUtil} from '../../../shared/password.util';
import {PagableSpecialists} from '../pagableSpecialist.interface';
import {PaginationSortUtil} from '../../../shared/pagination-sorting.utils';
import {Logger} from 'winston';
import { ServiceEmailDto } from '../../../email/serviceEmail.dto';
import { MailParams } from '../../../email/mailParams';
import { EmailService } from '../../../email/service/email.service';
import { SERVICE_NAME } from '../../../email/email.dto';
import { CustomNodeJsGlobal } from '../../../shared/custom.interface';
declare const global: CustomNodeJsGlobal;
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SpecialistService implements ISpecialistService {
  [x: string]: any;
  static findSpecialistsByHospital(id: any) {
    throw new Error("Method not implemented.");
  }

  constructor(
      @InjectRepository(SpecialistEntity) private specialistModel: Repository<SpecialistEntity>,
      @Inject(forwardRef(() => UserService))
      private userService: UserService,
      private mailerService: MailerService,
      private emailService: EmailService,
      @Inject('winston') private readonly logger: Logger,
  ) {}

  async getAllSpecialists(): Promise<GetSpecialist[]> {
    const specialists = await this.specialistModel.find()
    this.logger.log({
      level: 'info',
      message: 'Get all specialists request',
    });
    return specialists;
  }

  async getAllSpecialistsByStatus(usersIDs: string[], specialistStatus: string): Promise<GetSpecialist[]> {
    const specialists = await this.specialistModel.find({user: { $in: usersIDs }, specialistStatus})
    this.logger.log({
      level: 'info',
      message: `Get All Specialists By Status ${specialistStatus}`,
    });
    return specialists;
  }

  async findSpecialistById(_id: string): Promise<GetSpecialist | null> {
    const specialist = await this.specialistModel.findById(_id)
    this.logger.log({
      level: 'info',
      message: 'Get specialist by id request',
    });
    return specialist;
  }

  async findSpecialistByUserId(_id: string): Promise<Specialist | null> {
    const specialist = await this.specialistModel.findOne({user: _id});
    this.logger.log({
      level: 'info',
      message: 'Get specialist by user id request',
    });
    return specialist;
  }

 async findSpecialistsByHospital(_idHospital: string, index: number, elementsPerChunk: number, field: string, order: number, populatedField: string): Promise<PagableSpecialists> {
    let options = { sort: {} };
    if (populatedField) {
        options.sort[populatedField] = order;
    }
    const specialists = await PaginationSortUtil.customQuery(this.specialistModel.find({hospital: _idHospital}), {index, elementsPerChunk, field, order})
    this.logger.log({
      level: 'info',
      message: 'Get specialists by hospital id request',
    });
    return  {data: specialists, count: await this.specialistModel.count({hospital: _idHospital})};
  }

  async createSpecialist(specialistDto: SpecialistDto): Promise<Specialist> {
    if (specialistDto.email) {
        specialistDto.email = specialistDto.email.toLowerCase();
    }
    const newPassword = PasswordUtil.customPassword();
    const identifier = await this.userService.generateIdentifier();
    const user: UserDto = {password: newPassword, email: specialistDto.email, roles: [Role[Role.SPECIALIST]] as any, identifier, lang: specialistDto.lang};
    const existingUser = await this.userService.findUserByEmail(specialistDto.email);
    let isSpecialistNew: boolean = true;

    // clinic can create specialist with clinic login, but only once
    if (existingUser) {
        throw new UserAlreadyExistsException({message: `Specialist ${specialistDto.email} already exists`, error: `0`});
        // const clinicRole: any = Role[Role.CLINIC];
        // const isClinic = existingUser.roles.find(r => r === clinicRole);
        // if (!isClinic) {
        //     throw new UserAlreadyExistsException(`User for specialist ${specialistDto.email} already exists`);
        // }
        // const existingSpecialist = await this.findSpecialistByUserId(existingUser._id);
        // if (existingSpecialist) {
        //     throw new UserAlreadyExistsException(`Specialist ${specialistDto.email} already exists`);
        // }
        // specialistDto.user = existingUser._id;
        // isSpecialistNew = false;
    } else {
        const newSpecialistUser = await this.userService.createUser(user);
        specialistDto.user = newSpecialistUser._id;
    }

    if (+new Date(specialistDto.dateOfHiring) < Date.now()) {
      specialistDto.specialistStatus = SPECIALIST_STATUS.WORKS;
    }
    const createSpecialist = await this.specialistModel(specialistDto);
    const savedSpecialist = createSpecialist.save();
    savedSpecialist.then(specialist => {});
    this.logger.log({
      level: 'info',
      message: 'Create specialist request',
    });
    return savedSpecialist;
  }

  async createSpecialistNew(specialistDto: SpecialistDto): Promise<Specialist> {
    if (specialistDto.email) {
        specialistDto.email = specialistDto.email.toLowerCase();
    }
    // const newPassword = PasswordUtil.customPassword();
    const identifier = await this.userService.generateIdentifier();
    const user: UserDto = {password: specialistDto.password, email: specialistDto.email, roles: [Role[Role.SPECIALIST]] as any, identifier, lang: specialistDto.lang};
    const existingUser = await this.userService.findUserByEmail(specialistDto.email);
    let isSpecialistNew: boolean = true;

    // clinic can create specialist with clinic login, but only once
    if (existingUser) {
        throw new UserAlreadyExistsException({
          message: `Specialist ${specialistDto.email} already exists`,
          email: specialistDto.email,
          error: `0`
        });
        // const clinicRole: any = Role[Role.CLINIC];
        // const isClinic = existingUser.roles.find(r => r === clinicRole);
        // if (!isClinic) {
        //     throw new UserAlreadyExistsException(`User for specialist ${specialistDto.email} already exists`);
        // }
        // const existingSpecialist = await this.findSpecialistByUserId(existingUser._id);
        // if (existingSpecialist) {
        //     throw new UserAlreadyExistsException(`Specialist ${specialistDto.email} already exists`);
        // }
        // specialistDto.user = existingUser._id;
        // isSpecialistNew = false;
    } else {
        const newSpecialistUser = await this.userService.createUser(user);
        specialistDto.user = newSpecialistUser._id;
    }

    if (!specialistDto.dateOfHiring) {
      specialistDto.dateOfHiring = new Date()
    }
    if (!specialistDto.specialistStatus) {
      specialistDto.specialistStatus = SPECIALIST_STATUS.WORKS
    }
    if (+new Date(specialistDto.dateOfHiring) < Date.now()) {
      specialistDto.specialistStatus = SPECIALIST_STATUS.WORKS;
    }
    const createSpecialist = await this.specialistModel(specialistDto);
    const savedSpecialist = createSpecialist.save();
    savedSpecialist.then(specialist => {
      this.specialistModel, () => {})
    this.logger.log({
      level: 'info',
      message: 'Create specialist request',
    });
    return savedSpecialist;
  }

  async updateSpecialist(_id: string, specialist: SpecialistDto, sendDownloadLink: boolean): Promise<Specialist | null> {
    if (specialist.email) {
      specialist.email = specialist.email.toLowerCase();
      let isEmailBelongsToUserBySpecialistId: boolean;
      const specialistById = await this.findSpecialistById(_id);
      await this.specialistModel.findById(_id).then(createdSpecialist => {
        if (createdSpecialist.email === specialist.email)  {
          isEmailBelongsToUserBySpecialistId = true;
        }
      }).catch(err => {
        this.logger.log({
          level: 'error',
          message: err,
        });
        // Logger.error(err);
        throw new InternalServerErrorException({
            message: err,
            error: `0`,
        });
      });
      if (isEmailBelongsToUserBySpecialistId) {
        return await this.specialistModel.findByIdAndUpdate(_id, specialist, { new: true });
      } else {
        const createdUser = await this.userService.findUserByEmail(specialist.email);
        if (!createdUser) {
          const updatedUser = await this.userService.updateUser(specialist.user,
            {email: specialist.email, token: null, lang: specialistById?.user?.lang || 'en'});
          if (updatedUser) {
            const templParams = new Map();
            templParams.set('specialistsFirstName', specialist.firstName);
            templParams.set('specialistsLastName', specialist.lastName);
            templParams.set('email', specialist.email);
            const mailParams: MailParams = {
              successMessage: `Mail with new specialist ${specialist.email} successfully sent`,
              failMessage: `Could not send email for new specialist ${specialist.email}`,
              replaceParams: templParams,
            };
            const serviceEmailDto: ServiceEmailDto = {
              recipient: specialist.email,
              mailParams: mailParams,
              serviceName: SERVICE_NAME.UPDATED_SPECIALIST,
              lang: updatedUser.lang,
              sendDownloadLink: sendDownloadLink,
            };
            this.emailService.sendServiceEmailToRecipient(serviceEmailDto);
            const updatedEmailSpecialist = await this.specialistModel.findByIdAndUpdate(_id, specialist, {new: true});
            this.logger.log({
              level: 'info',
              message: 'Update specialist request',
            });
            return updatedEmailSpecialist;
          } else {
            this.logger.log({
              level: 'error',
              message: `Error while updating email to user with id: ${specialist.user}`,
            });
            throw new InternalServerErrorException({
              message: `Error while updating email to user with id: ${specialist.user}`,
              error: `0`,
            });
          }
        } else {
          throw new InternalServerErrorException({
            message: `User with ${specialist.email} already exist`,
            error: `0`,
          });
        }
      }
    }
    const updatedSpecialist = await this.specialistModel.findByIdAndUpdate(_id, specialist, {new: true});
    this.logger.log({
      level: 'info',
      message: 'Update specialist request',
    });
    return updatedSpecialist;
  }

  async deleteSpecialist(_id: string): Promise<any> {
    const deletedSpecialist = await this.specialistModel.findByIdAndRemove(_id);
    this.logger.log({
      level: 'info',
      message: 'Delete specialist request',
    });
    return deletedSpecialist;
  }

  async addSpecialistAndPatientConnections(specialistId: string, patientId: string) {
    const specialist = await this.specialistModel.findById(specialistId);
    if (!specialist.patients.includes(patientId)) {
      specialist.patients.push(patientId);
      specialist.save();
    }
    this.logger.log({
      level: 'info',
      message: 'Add specialist and patient connection request',
    });
  }

  async removePatientFromSpecialist(specialistId: string, patientId: string) {
    const specialist = await this.specialistModel.findById(specialistId);
    const index = specialist.patients.indexOf(patientId);
    specialist.patients.splice(index, 1);
    specialist.save();
    this.logger.log({
      level: 'info',
      message: 'Remove patient from specialist request',
    });
  }
}
