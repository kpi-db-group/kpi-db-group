import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HospitalService } from '../service/hospital.service';
import { HospitalDto } from '../hospital.dto';
import {UseGuards} from '@nestjs/common';
import {AuthGuard} from '../../user/guard/auth.guard';
import {RolesGuard} from '../../user/guard/roles.guard';
import {Roles} from '../../shared/roles.decorator';

@Resolver('Hospital')
export class HospitalResolver {
    constructor(private hospitalService: HospitalService) {}

    @Query()
    @UseGuards(AuthGuard)
    async getAllHospitals() {
      return this.hospitalService.getAllHospitals();
    }

    @Query()
    @UseGuards(AuthGuard)
    async getHospitalById(@Args('_id') _id: string) {
      return this.hospitalService.findHospitalById(_id);
    }

    @Query()
    @UseGuards(AuthGuard)
    async inviteUser(
      @Args('email') email: string,
      @Args('hospitalId') hospitalId: string,
      @Args('specialistId') specialistId: string,
      ) {
        return this.hospitalService.inviteUser(email, hospitalId, specialistId);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN')
    async createHospital(
      @Args('name') name: string,
      @Args('city') city: string,
      @Args('mainEmail') mainEmail: string,
      @Args('additionalEmail') additionalEmail: string,
      @Args('hospitalStatus') hospitalStatus: string,
      @Args('country') country: string,
      @Args('lang') lang: string) {
        if (mainEmail) {
            mainEmail = mainEmail.toLowerCase();
        }
        if (additionalEmail) {
            additionalEmail = additionalEmail.toLowerCase();
        }
      const hospital: HospitalDto = {name, city, mainEmail, additionalEmail, hospitalStatus, country, lang};
      return await this.hospitalService.createHospital(hospital);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN', 'CLINIC')
    async updateHospital(
      @Args('_id') _id: string,
      @Args('name') name: string,
      @Args('city') city: string,
      @Args('mainEmail') mainEmail: string,
      @Args('additionalEmail') additionalEmail: string,
      @Args('hospitalStatus') hospitalStatus: string,
      @Args('country') country: string,
      @Args('user') user: string,
      @Args('sendDownloadLink') sendDownloadLink: boolean,
      ) {
        if (mainEmail) {
            mainEmail = mainEmail.toLowerCase();
        }
        if (additionalEmail) {
            additionalEmail = additionalEmail.toLowerCase();
        }
      const hospital: HospitalDto = {};
      if (name) {
        hospital.name = name;
      } if (city) {
        hospital.city = city;
      } if (mainEmail) {
        hospital.mainEmail = mainEmail;
      } if (additionalEmail) {
        hospital.additionalEmail = additionalEmail;
      } if (hospitalStatus) {
        hospital.hospitalStatus = hospitalStatus;
      } if (country) {
        hospital.country = country;
      } if (user) {
        hospital.user = user;
      }
      return await this.hospitalService.updateHospital(_id, hospital, sendDownloadLink);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN')
    async deleteHospital(
      @Args('_id') _id: string) {
      return await this.hospitalService.deleteHospital(_id);
    }
}
