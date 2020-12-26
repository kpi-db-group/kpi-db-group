import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseSchema } from './exercise.schema';
import { ExerciseTranslateionSchema } from '../exerciseTranslation/exerciseTranslate.schema';
import { ExerciseService } from './service/exercise.service';
import { ExerciseResolver } from './graphql/exercise.resolver';
import {UserModule} from '../../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExerciseSchema]),
        TypeOrmModule.forFeature([ExerciseTranslateionSchema]),
        UserModule,
    ],
    exports: [ExerciseService],
    providers: [ExerciseService, ExerciseResolver],
})
export class ExerciseModule {}
