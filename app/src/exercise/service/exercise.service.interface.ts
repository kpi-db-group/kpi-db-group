import { Exercise } from '../exercise.interface';
import { ExerciseDto } from '../exercise.dto';

export interface IExerciseService {
  getAllExercisesByLang(lang: string): Promise<Exercise[]>;
  findExerciseById(_id: string): Promise<Exercise | null>;
  findExerciseByLang(lang: string): Promise<Exercise[] | null>;
  getExerciseByIdAndLang(_id: string, lang: string): Promise<Exercise | null>;
  createExercise(exerciseDto: ExerciseDto): Promise<Exercise>;
  updateExercise(_id: string, exerciseDto: ExerciseDto): Promise<Exercise | null>;
  deleteExercise(_id: string): Promise<string>;
  getExercisesBySpecialistId(_id: string): Promise<Exercise[] | null>;
  find(lang: string, _ids: string[]): Promise<Exercise[] | null>;
}
