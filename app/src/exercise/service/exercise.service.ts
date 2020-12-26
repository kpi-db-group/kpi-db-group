import { Injectable, Inject } from '@nestjs/common';
import { Exercise } from '../exercise.interface';
import { ExerciseTranslation } from '../../exerciseTranslation/exerciseTranslate.interface';
import { ExerciseDto } from '../exercise.dto';
import { IExerciseService } from './exercise.service.interface';
import { Logger } from 'winston';

@Injectable()
export class ExerciseService implements IExerciseService {

    constructor
    (
        @InjectRepository(ExerciseEntity) private exerciseModel: Repository<ExerciseEntity>,
        @InjectRepository(ExerciseTranslation) private exerciseTranslationModel: Repository<ExerciseTranslation>,
        @Inject('winston') private readonly logger: Logger
    )
    {}

    async getAllExercisesByLang(lang: string): Promise<Exercise[]> {
        const exercises = await this.exerciseModel.find()
        this.logger.log({
            level: 'info',
            message: 'Get all exercises request'
        });
        let exercisesByLang:Exercise[] = [];
        for (const exercise of exercises) {
            for (const translation of exercise.translation.translations) {
                if (lang === translation.lang) {
                    exercise.name = translation.name;
                    exercise.description = translation.description;
                    exercisesByLang.push(exercise);
                }
            }
        }
        return exercisesByLang.filter(exercise => !exercise.specialist);
    }

    async findExerciseById(_id: string): Promise<Exercise | null> {
        const exercise = await this.exerciseModel.findById(_id)
        this.logger.log({
            level: 'info',
            message: 'Get exercise by id request'
        });
        for (const translation of exercise.translation.translations) {
            if (exercise.lang === translation.lang) {
                exercise.name = translation.name;
                exercise.description = translation.description;
            }
        }
        return exercise;
    }

    async findExerciseByLang(lang: string): Promise<Exercise[] | null> {
        const exercise = await this.exerciseModel.find({lang})
        this.logger.log({
            level: 'info',
            message: 'Get exercise by lang request'
        });
        for (const translation of exercise.translation.translations) {
            if (exercise.lang === translation.lang) {
                exercise.name = translation.name;
                exercise.description = translation.description;
            }
        }
        return exercise;
    }

    async getExerciseByIdAndLang(_id: string, lang: string): Promise<Exercise | null> {
        const exercise = await this.exerciseModel.findById(_id)
        this.logger.log({
            level: 'info',
            message: 'Get exercise by id and lang request'
        });
        for (const translation of exercise.translation.translations) {
            if (lang === translation.lang) {
                exercise.name = translation.name;
                exercise.description = translation.description;
                exercise.lang = translation.lang;
            }
        }
        return exercise;
    }

    async createExercise(exerciseDto: ExerciseDto): Promise<Exercise> {
        const newExerciseTranslate = await this.exerciseTranslationModel(
            {translations : {lang: exerciseDto.lang, name: exerciseDto.name, description: exerciseDto.description}}
        );
        this.logger.log({
            level: 'info',
            message: 'Create exercise request'
        });
        const newExerciseTranslation = await newExerciseTranslate.save();
        if (newExerciseTranslate) {
            exerciseDto.translation = newExerciseTranslate.id;
            const newExercise = await this.exerciseModel(exerciseDto);
            return await newExercise.save();
        }
    }

    async updateExercise(_id: string, exerciseDto: ExerciseDto): Promise<Exercise | null> {
        if (exerciseDto.lang && (exerciseDto.name || exerciseDto.description)) {
            const exercise = await this.exerciseModel.findById(_id)
            for (const translation of exercise.translation.translations) {
                if (exerciseDto.lang === translation.lang) {
                    translation.name = exerciseDto.name;
                    translation.description = exerciseDto.description;
                    break;
                }
            }
            function isTranslationExist(translation) {
                const requestLang = exerciseDto.lang;
                return translation.lang === requestLang;
            }
            if (!exercise.translation.translations.find(isTranslationExist)) {
                exercise.translation.translations.push({lang: exerciseDto.lang, name: exerciseDto.name, description: exerciseDto.description});
            }
            await this.exerciseTranslationModel.findByIdAndUpdate(exercise.translation._id, {translations: exercise.translation.translations}, { new: true });
        }
        // if (exerciseDto.lang !== "us") {
        //     delete exerciseDto.lang;
        //     delete exerciseDto.name;
        //     delete exerciseDto.description;
        // }
        const updatedExercise = await this.exerciseModel.findByIdAndUpdate(_id, exerciseDto, { new: true });
        this.logger.log({
            level: 'info',
            message: 'Update exercise request'
        });
        return updatedExercise;
    }

    async deleteExercise(_id: string): Promise<any> {
        const deletedExercise = await this.exerciseModel.findByIdAndRemove(_id);
        this.logger.log({
            level: 'info',
            message: 'Delete exercise request'
        });
        await this.exerciseTranslationModel.findByIdAndRemove(deletedExercise.translation).exec();
        return deletedExercise;
    }

    async getExercisesBySpecialistId(_id: string): Promise<Exercise[] | null> {
      const exercise = await this.exerciseModel.find({specialist: _id})
      this.logger.log({
          level: 'info',
          message: 'Get exercise by specialist request'
      })
      return exercise
    }

    async find(lang: string, _ids: string[]): Promise<any> {
      const result = []
      for (let i = 0; i < _ids.length; i++) {
        const specialistExercises = await this.getExercisesBySpecialistId(_ids[i])
        result.push(...specialistExercises)
      }
      const exercises = await this.getAllExercisesByLang(lang)
      this.logger.log({
          level: 'info',
          message: 'Get exercises by lang request'
      })
      return [...result, ...exercises]
    }

}
