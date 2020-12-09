import {Injectable, Logger, NotFoundException, UnauthorizedException, InternalServerErrorException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {HospitalUserPayload, JwtPayload, PatientUserPayload, SpecialistUserPayload, PatientLidUserPayload} from './interfaces/jwt.payload.interface';
import {UserService} from '../user/service/user.service';
import {User} from '../user/user.interface';
import {AuthDto} from './auth.dto';
import * as bcrypt from 'bcrypt';
import {MailerService} from '@nest-modules/mailer';
import {Role} from '../user/user.dto';
import {SpecialistService} from '../specialist/specialist/service/specialist.service';
import {HospitalService} from '../hospital/service/hospital.service';
import {PatientService} from '../patient/patient/service/patient.service';
import {RoleNotExistsException} from '../shared/excpetion/role-not-exists.exception';
import {UserNotActivatedException} from '../shared/excpetion/user-not-activated-exception';
import {LoginAttemptsExceededException} from '../shared/excpetion/login-attempts-exceeded.exception';
import {ExpiredMarkException} from '../shared/excpetion/expired-mark.exception';
import { ServiceEmailDto } from '../email/serviceEmail.dto';
import { MailParams } from '../email/mailParams';
import { EmailService } from '../email/service/email.service';
import { SERVICE_NAME } from '../email/email.dto';
import * as uuid from 'uuid/v4';
import { CustomNodeJsGlobal } from '../shared/custom.interface';
declare const global: CustomNodeJsGlobal;

@Injectable()
export class AuthService {

    private TEN_MINUTES_MS: number = 10 * 60 * 1000;
    private WRONG_ATTEMPTS_TO_BLOCK: number = 5;

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailerService: MailerService,
        private emailService: EmailService,
        private specialistService: SpecialistService,
        private hospitalService: HospitalService,
        private patientService: PatientService,
        private patientLidService: PatientLidService,
    ) {

    }

    async login(loginAttempt: AuthDto) {
        const userToAttempt = await this.userService.findUserByEmail(loginAttempt.login);

        return new Promise((resolve, reject) => {
            if (!userToAttempt || !userToAttempt.password) {
                reject(new UnauthorizedException());
                return;
            }
            // Check selected on ui role
            if (!this.hasRole(userToAttempt.roles, Role[Role.ADMIN]) && !this.hasRole(userToAttempt.roles, loginAttempt.role)) {
                reject(new RoleNotExistsException({message: `Role ${loginAttempt.role} doesn't exist on user ${loginAttempt.login}`, error: `1`}));
                return;
            }
            // Check user is blocked
            if (userToAttempt.limitedAccess) {
                reject(new UnauthorizedException());
                return;
            }

            // Check user isn't activated
            if (this.hasRole(userToAttempt.roles, Role[Role.PATIENT_LID])) {
                this.patientLidService.getPatientLidByUserId(userToAttempt._id).then(patient => {
                    if (!patient.active) {
                        reject(new UserNotActivatedException({message: "The user doesn't activated", error: `3`}));
                        return;
                    }
                });

            }

            // Check the supplied password against the hash stored for this login
            this.checkPassword(userToAttempt, loginAttempt.password, loginAttempt.rememberMe, async (err, isMatch, rememberMe) => {

                if (err) {
                    reject(new UnauthorizedException(`some internal error appeared`));
                    return;
                }
                const validAttemptsForBlocking = this.getValidAttemptsForBlocking(userToAttempt);
                if (validAttemptsForBlocking.length >= this.WRONG_ATTEMPTS_TO_BLOCK) {
                    const wrongAttemptsSortedNaturalOrder = validAttemptsForBlocking.sort((a, b) => a.getTime() - b.getTime());
                    const lastWrongAttempt = wrongAttemptsSortedNaturalOrder[wrongAttemptsSortedNaturalOrder.length - 1];
                    const currentTimestamp = new Date().getTime();
                    const secondsToUnblock = Math.abs(Math.ceil((currentTimestamp - lastWrongAttempt.getTime() - this.TEN_MINUTES_MS) / 1000));
                    Logger.debug(`User ${JSON.stringify(userToAttempt)} is blocked}`);
                    reject(new LoginAttemptsExceededException({
                        message: `Login attempts exceeded: ${userToAttempt.wrongLoginAttemptsCycle}`,
                        secondsToUnblock,
                        error: `2`,
                    }));
                    return;
                }

                if (isMatch) {

                    if(!userToAttempt.enabled) {
                        reject(new UserNotActivatedException({
                            message: `Account has been disabled, contact admin for more details`,
                            error: `4`,
                        }));
                    }
                    // user enter correct credentials - clear failure attempts counter
                    const updatedUser = this.userService.updateUser(userToAttempt._id, {
                        wrongLoginAttemptsCycle: [],
                    });
                    // If there is a successful match, generate a JWT for the user
                    const createdJwtToken = await this.createJwtPayload(userToAttempt, rememberMe);
                    const updatedUserAndToken = await this.userService.updateUser(userToAttempt._id, {
                        token: createdJwtToken.token,
                        lang: loginAttempt.lang ? loginAttempt.lang : 'en',
                        lastLoginDate: new Date(),
                        firstLoginDate: userToAttempt.firstLoginDate ? userToAttempt.firstLoginDate : new Date()
                    });
                    resolve({token : updatedUserAndToken.token});
                    return;

                } else {
                    // password incorrect, so increase amount of wrong attempts
                    if (validAttemptsForBlocking.length < this.WRONG_ATTEMPTS_TO_BLOCK) {
                        this.userService.updateUser(userToAttempt._id, {
                            wrongLoginAttemptsCycle: [
                                ...userToAttempt.wrongLoginAttemptsCycle,
                                new Date(),
                            ],
                        });
                    }
                    reject(new UnauthorizedException());
                    return;
                }
            });
        });
    }

    async checkPassword(userToAttempt: User, attemptPassword, rememberMe, callback) {
        bcrypt.compare(attemptPassword, userToAttempt.password, (err, isMatch) => {
            if (err) {
                return callback(err);
            }
            callback(null, isMatch, rememberMe);
        });
    }

    createJwtPayload(user: User, rememberMe: boolean) {
        const SPECIALIST_ROLE: string = Role[Role.SPECIALIST];
        const PATIENT_ROLE: string = Role[Role.PATIENT];
        const CLINIC_ROLE: string = Role[Role.CLINIC];
        const ADMIN_ROLE: string = Role[Role.ADMIN];
        const PATIENT_LID_ROLE: string = Role[Role.PATIENT_LID];
        const currentUserRoles = user.roles as any;
        let jwt;
        if (this.hasRole(currentUserRoles, CLINIC_ROLE)) {
            return this.hospitalService.findHospitalByUserId(user._id).then(hospital => {
                const hospitalPayload: HospitalUserPayload = {
                    id: user._id,
                    email: user.email,
                    firstName: hospital.name,
                    roles: user.roles,
                    clinic: hospital._id,
                    limitedAccess: user.limitedAccess,
                    identifier: user.identifier,
                };

                return {
                    token: this.createTokenInternal(hospitalPayload, rememberMe),
                };
            });
        }
        if (this.hasRole(currentUserRoles, ADMIN_ROLE)) {
            const adminPayload: JwtPayload = {
                id: user._id,
                email: user.email,
                roles: user.roles,
                limitedAccess: user.limitedAccess,
                identifier: user.identifier,
            };
            jwt = this.jwtService.sign(adminPayload);
            return {
                token: this.createTokenInternal(adminPayload, rememberMe),
            };
        }
        if (this.hasRole(currentUserRoles, SPECIALIST_ROLE)) {
            return this.specialistService.findSpecialistByUserId(user._id).then(specialist => {
                const specialistPayload: SpecialistUserPayload = {
                    id: user._id,
                    email: user.email,
                    firstName: specialist.firstName,
                    lastName: specialist.lastName,
                    roles: user.roles,
                    clinic: specialist.hospital,
                    specialist: specialist._id,
                    limitedAccess: user.limitedAccess,
                    identifier: user.identifier,
                };

                jwt = this.jwtService.sign(specialistPayload);

                return {
                    token: this.createTokenInternal(specialistPayload, rememberMe),
                };
            });
        }

        if (this.hasRole(currentUserRoles, PATIENT_ROLE)) {
            return this.patientService.findPatientByUserId(user._id).then(patient => {
                const patientPayload: PatientUserPayload = {
                    id: user._id,
                    email: user.email,
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    roles: user.roles,
                    clinic: patient.hospital,
                    patient: patient._id,
                    limitedAccess: user.limitedAccess,
                    identifier: user.identifier,
                };

                jwt = this.jwtService.sign(patientPayload);

                return {
                    token: this.createTokenInternal(patientPayload, rememberMe),
                };
            });
        }

        if (this.hasRole(currentUserRoles, PATIENT_LID_ROLE)) {
            return this.patientLidService.getPatientLidByUserId(user._id).then(patient => {
                const patientPayload: PatientLidUserPayload = {
                    id: user._id,
                    email: user.email,
                    roles: user.roles,
                    limitedAccess: user.limitedAccess,
                    identifier: user.identifier,
                    patientLid: patient._id,
                };

                jwt = this.jwtService.sign(patientPayload);

                return {
                    token: this.createTokenInternal(patientPayload, rememberMe),
                };
            });
        }
    }

    private createTokenInternal(payload, rememberMe: boolean) {
        if (rememberMe) {
            // 1 year expiration
            return this.jwtService.sign(payload, {expiresIn: '365D'});
        }
        return this.jwtService.sign(payload);
    }

    async sendRestoringPasswordMail(email: string) {
        if (email) {
            email = email.toLowerCase();
        }
        const user = await this.userService.findUserByEmail(email);
        if (user) {
            const roleSpecificUserInfo = await this.getRoleSpecificUserInfo(user);
            Logger.debug(`Restoring password for user ${user._id}`);
            const fullName = this.buildFullName(roleSpecificUserInfo, user);

            const refreshedUserMark = user._id + uuid();
            await this.userService.updateUser(user._id, {mark: refreshedUserMark, markCreateDate: new Date()});
            Logger.debug(`Mark refreshed for user ${user._id}`);
            Logger.debug(`Update hospital user request`);
            let setPasswordLink = global.config.network.PROTOCOL + '://' + global.config.network.HOST + global.config.network.POSTFIX + '/setPassword/' + refreshedUserMark + '/' + user.lang;
            this
                .mailerService
                .sendMail({
                    to: email,
                    from: ``,
                    subject: '',
                    text: '',
                    html: ``,
                })
                .then((res) => {
                    Logger.debug(`Restoring mail password successfully sent`);
                })
                .catch((err) => {
                    Logger.error(`Could not send email with restored password`);
                    Logger.error(err);
                });

            return true;
        }

        throw new NotFoundException(`user with mail ${email} not found`);
    }

    private buildFullName(roleSpecificUserInfo: any, user: User) {
        let fullName;
        if (!roleSpecificUserInfo.firstName && !roleSpecificUserInfo.lastName && !roleSpecificUserInfo.name) {
            fullName = user.roles[0] ? Role[user.roles[0]] : `anonymous`;
        } else if (!roleSpecificUserInfo.name) {
            fullName = `${roleSpecificUserInfo.firstName} ${roleSpecificUserInfo.lastName}`;
        } else {
            fullName = `${roleSpecificUserInfo.name}`;
        }
        return fullName;
    }

    async getRoleSpecificUserInfo(user: User) {
        const ANY_ROLE: string = Role[Role.ALL];
        const ADMIN_ROLE: string = Role[Role.ADMIN];
        const CLINIC_ROLE: string = Role[Role.CLINIC];
        const SPECIALIST_ROLE: string = Role[Role.SPECIALIST];
        const PATIENT_ROLE: string = Role[Role.PATIENT];
        const currentRoles: string[] = user.roles.map(currRole => currRole.toString());

        if (this.hasRole(currentRoles, ADMIN_ROLE)) {
            return {};
        }
        if (this.hasRole(currentRoles, CLINIC_ROLE)) {
            return await this.hospitalService.findHospitalByUserId(user._id);
        }
        if (this.hasRole(currentRoles, PATIENT_ROLE)) {
            return await this.patientService.findPatientByUserId(user._id);
        }
        if (this.hasRole(currentRoles, SPECIALIST_ROLE)) {
            return await this.specialistService.findSpecialistByUserId(user._id);
        }
        Logger.debug(`roles ${currentRoles} is not found or not implemented yet`);
    }

    private hasRole(currentRoles, role) {
        return currentRoles.some(currRole => currRole === role);
    }

    private getValidAttemptsForBlocking(userToAttempt: User) {
        const currentTimestamp = new Date().getTime();
        const tenMinutesAgoTimestamp = currentTimestamp - this.TEN_MINUTES_MS;
        return userToAttempt.wrongLoginAttemptsCycle
            .filter(attempt => tenMinutesAgoTimestamp < attempt.getTime());
    }

    async restore(restoreToken: any) {
          const user = await this.userService.findUserByRestoringToken(restoreToken);
          if (!user) {
              return false;
          }

          const roleSpecificUserInfo = await this.getRoleSpecificUserInfo(user);
          const fullName = this.buildFullName(roleSpecificUserInfo, user);

          const userMark = user._id + uuid();
          let setPasswordLink = global.config.network.PROTOCOL + '://' + global.config.network.HOST + global.config.network.POSTFIX + '/setPassword/' + userMark + '/' + user.lang;
          this
              .mailerService
              .sendMail({
                  to: user.email,
                  from: ``,
                  subject: '',
                  text: '',
                  html: ``,
              })
              .then((res) => {
                  Logger.debug(`Mail with restore password link successfully sent`);
                  const userAfterClearingRestoringToken = this.userService.clearRestoringToken(user._id).then(res => {
                      Logger.debug(`User token cleared after success restoring: ${JSON.stringify(userAfterClearingRestoringToken)}`);
                  });
              })
              .catch((err) => {
                  Logger.error(`Could not send email with restore password link`);
                  Logger.error(err);
              });

          return user.email;
    }

     async unsubscribe(emailToken) {
       if (emailToken) {
           const user = await this.userService.findUserByUserToken(emailToken);
           if (!user) {
             return false;
           } else {
             return user?.email;
           }
       } else {
         return false;
       }
     }

     async refreshMark(id: string) {
        const userByMark = await this.userService.findUserById(id);
        if (userByMark) {
            const roleSpecificUserInfo = await this.getRoleSpecificUserInfo(userByMark);
            const fullName = this.buildFullName(roleSpecificUserInfo, userByMark);
            const refreshedUserMark = userByMark._id + uuid();
            await this.userService.updateUser(userByMark._id, {mark: refreshedUserMark, markCreateDate: new Date()});
            Logger.debug(`Mark refreshed for user ${userByMark._id}`);
            Logger.debug(`Update hospital user request`);
            let setPasswordLink = global.config.network.POSTFIX + '://' + global.config.network.HOST + global.config.network.PROTOCOL + '/setPassword/' + refreshedUserMark + '/' + userByMark.lang;
            this.mailerService.sendMail({
                to: userByMark.email,
                from: ``,
                subject: ': Refresh mark',
                text: '',
                html: ``,
            })
            .then((res) => {
                Logger.debug(`Mail with new password successfully sent`);
            })
            .catch((err) => {
                Logger.error(`Could not send email with restored password`);
                Logger.error(err);
            });
        } else {
            throw new InternalServerErrorException({
                message: `Error`,
                error: `0`,
            });
        }

   }


     async applyPasswordToUser(data: any) {
        if (data.mark) {
            const userByMark = await this.userService.findUserById(data.mark.slice(0, 24));
            if (userByMark && userByMark.markCreateDate) {
                if (+userByMark.markCreateDate + 86400000 > Date.now()) {
                    const roleSpecificUserInfo = await this.getRoleSpecificUserInfo(userByMark);
                    const fullName = this.buildFullName(roleSpecificUserInfo, userByMark);
                    const updatedUser = await this.userService.updateUser(userByMark._id, { password: data.password })
                    await this.userService.updateUser(userByMark._id, {mark: null, markCreateDate: null})
                    Logger.debug(`Password for user ${userByMark._id} changed to ${updatedUser.password}`);
                    this.mailerService.sendMail({
                        to: userByMark.email,
                        from: ``,
                        subject: '',
                        text: '',
                        html: ``,
                    })
                    .then((res) => {
                        Logger.debug(`Mail with new password successfully sent`);
                    })
                    .catch((err) => {
                        Logger.error(`Could not send email with restored password`);
                        Logger.error(err);
                    });
                } else {
                    throw new  ExpiredMarkException({
                        message: `Expired mark error`,
                        error: `6`,
                    });
                }
            } else {
                throw new InternalServerErrorException({
                    message: `Error`,
                    error: `0`,
                });
            }
        } else {
            throw new InternalServerErrorException({
                message: `Error`,
                error: `0`,
            });
        }
    }

}
