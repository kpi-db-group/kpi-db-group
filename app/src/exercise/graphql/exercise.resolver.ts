import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExerciseService } from '../service/exercise.service';
import { ExerciseDto } from '../exercise.dto';
import {UseGuards} from '@nestjs/common';
import {AuthGuard} from '../../../user/guard/auth.guard';
import {RolesGuard} from '../../../user/guard/roles.guard';
import {Roles} from '../../../shared/roles.decorator';

@Resolver('Exercise')
export class ExerciseResolver {
    constructor(private exerciseService: ExerciseService) {}

    @Query()
    @UseGuards(AuthGuard)
    async getAllExercisesByLang(@Args('lang') lang: string) {
      return await this.exerciseService.getAllExercisesByLang(lang);
    }

    @Query()
    @UseGuards(AuthGuard)
    async find(@Args('lang') lang: string, @Args('_ids') _ids: string[]) {
      return await this.exerciseService.find(lang, _ids);
    }

    @Query()
    @UseGuards(AuthGuard)
    async getExercisesByLang(@Args('lang') lang: string) {
      return await this.exerciseService.findExerciseByLang(lang);
    }

    @Query()
    @UseGuards(AuthGuard)
    async getExerciseById(@Args('_id') _id: string) {
      return await this.exerciseService.findExerciseById(ObjectId(_id));
    }

    @Query()
    @UseGuards(AuthGuard)
    async getExerciseByIdAndLang(@Args('_id') _id: string, @Args('lang') lang: string) {
      return await this.exerciseService.getExerciseByIdAndLang(_id, lang);
    }

    @Query()
    @UseGuards(AuthGuard)
    async getExercisesBySpecialistId(@Args('_id') _id: string) {
      return await this.exerciseService.getExercisesBySpecialistId(_id)
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN', 'SPECIALIST')
    async createExercise(
      @Args('name') name: string,
      @Args('description') description: string,
      @Args('link') link: string,
      @Args('pictureLink') pictureLink: string,
      @Args('gifLink') gifLink: string,
      @Args('lang') lang: string,
      @Args('forGames') forGames: string[],
      @Args('classifierId') classifierId: string,
      @Args('exerciseType') exerciseType: string,
      @Args('commandRight') commandRight: string,
      @Args('commandLeft') commandLeft: string,
      @Args('bodyPart') bodyPart: string,
      @Args('displayForPatient') displayForPatient: boolean,
      @Args('displayForSpecialist') displayForSpecialist: boolean,
      @Args('specialist') specialist: string,
      @Args('phonePlacement') phonePlacement: string,
    ) {
      const exerciseDto: ExerciseDto = {
        name,
        description,
        link,
        pictureLink,
        gifLink,
        lang,
        forGames,
        classifierId,
        exerciseType,
        commandRight,
        commandLeft,
        bodyPart,
        displayForPatient,
        displayForSpecialist,
        specialist,
        phonePlacement
      };
      return await this.exerciseService.createExercise(exerciseDto);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN', 'SPECIALIST')
    async updateExercise(
      @Args('_id') _id: string,
      @Args('name') name: string,
      @Args('description') description: string,
      @Args('link') link: string,
      @Args('pictureLink') pictureLink: string,
      @Args('gifLink') gifLink: string,
      @Args('lang') lang: string,
      @Args('forGames') forGames: string[],
      @Args('classifierId') classifierId: string,
      @Args('exerciseType') exerciseType: string,
      @Args('commandRight') commandRight: string,
      @Args('commandLeft') commandLeft: string,
      @Args('bodyPart') bodyPart: string,
      @Args('displayForPatient') displayForPatient: boolean,
      @Args('displayForSpecialist') displayForSpecialist: boolean,
      @Args('specialist') specialist: string,
      @Args('phonePlacement') phonePlacement: string,
    ) {
      const exerciseDto: ExerciseDto = {};
      if (name) {
        exerciseDto.name = name;
      } if (description) {
        exerciseDto.description = description;
      } if (link) {
        exerciseDto.link = link;
      } if (pictureLink != undefined) {
        exerciseDto.pictureLink = pictureLink;
      } if (gifLink != undefined) {
        exerciseDto.gifLink = gifLink;
      } if (lang) {
        exerciseDto.lang = lang;
      } if (forGames) {
        exerciseDto.forGames = forGames;
      } if (classifierId) {
        exerciseDto.classifierId = classifierId;
      } if (exerciseType) {
        exerciseDto.exerciseType = exerciseType;
      } if (commandRight) {
        exerciseDto.commandRight = commandRight;
      } if (commandLeft) {
        exerciseDto.commandLeft = commandLeft;
      } if (bodyPart) {
        exerciseDto.bodyPart = bodyPart;
      } if (displayForPatient) {
        exerciseDto.displayForPatient = displayForPatient;
      } if (displayForSpecialist) {
        exerciseDto.displayForSpecialist = displayForSpecialist;
      } if (specialist) {
        exerciseDto.specialist = specialist;
      } if (phonePlacement) {
        exerciseDto.phonePlacement = phonePlacement
      }
      return await this.exerciseService.updateExercise(_id, exerciseDto);
    }

    @Mutation()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN', 'SPECIALIST')
    async deleteExercise(
      @Args('_id') _id: string) {
      return await this.exerciseService.deleteExercise(_id)
    }
}
