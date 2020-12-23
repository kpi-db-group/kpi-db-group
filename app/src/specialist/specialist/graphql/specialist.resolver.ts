import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SpecialistService } from '../service/specialist.service';
import { SpecialistDto } from '../specialist.dto';
import {UseGuards} from '@nestjs/common';
import {AuthGuard} from '../../../user/guard/auth.guard';
import {RolesGuard} from '../../../user/guard/roles.guard';
import {Roles} from '../../../shared/roles.decorator';

@Resolver('Specialist')
export class SpecialistResolver {
    constructor(private specialistService: SpecialistService) {}

    @Query()
    @UseGuards(AuthGuard)
    async getAllSpecialists() {
      return this.specialistService.getAllSpecialists();
    }

    @Query()
    @UseGuards(AuthGuard)
    async getSpecialistById(@Args('_id') _id: string) {
      return this.specialistService.findSpecialistById(ObjectId(_id));
    }

  @Query()
  async getSpecialistsByHospital(
    @Args('_idHospital') _idHospital: string,
    @Args('index') index: number,
    @Args('elementsPerChunk') elementsPerChunk: number,
    @Args('field') field: string,
    @Args('order') order: number,
    @Args('populatedField') populatedField: string) {
    return this.specialistService.findSpecialistsByHospital(ObjectId(_idHospital), index, elementsPerChunk, field, order, populatedField);
  }

  @Query()
    @UseGuards(AuthGuard)
    async getAllSpecialistsByStatus(
      @Args('status') status: string) {
      return this.specialistService.findAllSpecialistsByStatus(status);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('CLINIC')
    async createSpecialist(
      @Args('firstName') firstName: string,
      @Args('lastName') lastName: string,
      @Args('secondaryName') secondaryName: string,
      @Args('dateOfBirth') dateOfBirth: Date,
      @Args('dateOfHiring') dateOfHiring: Date,
      @Args('dateOfFiring') dateOfFiring: Date,
      @Args('experience') experience: string,
      @Args('email') email: string,
      @Args('about') about: string,
      @Args('gender') gender: string,
      @Args('address') address: string,
      @Args('phoneNumber') phoneNumber: string,
      @Args('city') city: string,
      @Args('specialistSpecialization') specialistSpecialization: string,
      @Args('specialistStatus') specialistStatus: string,
      @Args('patients') patients: string[],
      @Args('hospital') hospital: string,
      @Args('user') user: string,
      @Args('firstLogin') firstLogin: boolean,
      @Args('lang') lang: string) {
        if (email) {
          email = email.toLowerCase();
        } if (!specialistStatus) {
          specialistStatus = 'works'
        } if (!dateOfHiring) {
          dateOfHiring = new Date()
        }
      const specialistDto: SpecialistDto = {firstName, lastName, secondaryName, dateOfBirth, dateOfHiring, dateOfFiring, experience,
        email, about, gender, address, phoneNumber, city, specialistSpecialization, specialistStatus, patients, hospital, user, lang, firstLogin};
      return await this.specialistService.createSpecialist(specialistDto);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('CLINIC', 'SPECIALIST')
    async updateSpecialist(
      @Args('_id') _id: string,
      @Args('firstName') firstName: string,
      @Args('lastName') lastName: string,
      @Args('secondaryName') secondaryName: string,
      @Args('dateOfBirth') dateOfBirth: Date,
      @Args('dateOfHiring') dateOfHiring: Date,
      @Args('dateOfFiring') dateOfFiring: Date,
      @Args('experience') experience: string,
      @Args('email') email: string,
      @Args('about') about: string,
      @Args('gender') gender: string,
      @Args('address') address: string,
      @Args('phoneNumber') phoneNumber: string,
      @Args('city') city: string,
      @Args('specialistSpecialization') specialistSpecialization: string,
      @Args('specialistStatus') specialistStatus: string,
      @Args('patients') patients: string[],
      @Args('hospital') hospital: string,
      @Args('user') user: string,
      @Args('sendDownloadLink') sendDownloadLink: boolean,
      @Args('firstLogin') firstLogin: boolean,
      ) {
        if (email) {
            email = email.toLowerCase();
        }
        const specialist: SpecialistDto = {}
        if (firstName) {
          specialist.firstName = firstName;
        } if (lastName) {
          specialist.lastName = lastName;
        } if (secondaryName) {
          specialist.secondaryName = secondaryName;
        } if (dateOfBirth) {
          specialist.dateOfBirth = dateOfBirth;
        } if (dateOfHiring) {
          specialist.dateOfHiring = dateOfHiring;
        } if (dateOfFiring) {
          specialist.dateOfFiring = dateOfFiring;
        } if (experience) {
          specialist.experience = experience;
        } if (email) {
          specialist.email = email;
        } if (about) {
          specialist.about = about;
        } if (gender) {
          specialist.gender = gender;
        } if (address) {
          specialist.address = address;
        } if (phoneNumber) {
          specialist.phoneNumber = phoneNumber;
        } if (city) {
          specialist.city = city;
        } if (specialistSpecialization) {
          specialist.specialistSpecialization = specialistSpecialization;
        } if (specialistStatus) {
          specialist.specialistStatus = specialistStatus;
        } if (patients) {
          specialist.patients = patients;
        } if (hospital) {
          specialist.hospital = hospital;
        } if (user) {
          specialist.user = user;
        } if (firstLogin != undefined) {
          specialist.firstLogin = firstLogin;
        }

      return await this.specialistService.updateSpecialist(_id, specialist, sendDownloadLink);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('CLINIC')
    async deleteSpecialist(
      @Args('_id') _id: string) {
      return await this.specialistService.deleteSpecialist(_id)
    }
}
