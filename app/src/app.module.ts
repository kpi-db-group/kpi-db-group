import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { HospitalModule } from './hospital/hospital.module';
import { UserModule } from './user/user.module';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SpecialistModule } from './specialist/specialist/specialist.module';
import { PatientModule } from './patient/patient/patient.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { StartupService } from './shared/startup.service';
import { ConnectionController } from './shared/connection.controller';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ScheduleModule } from '@nestjs/schedule';
import { RegisterController } from './register.controller';
import { VaultService } from './vault/vault.service';
import { DatabaseService } from './database.service'
import { MailerConfigService } from './mailer-config.service'
 
const myFormat =  winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({useClass: DatabaseService}),
    MailerModule.forRootAsync({useClass: MailerConfigService}),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
    }),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.label({ label: 'app' }),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        myFormat,
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new DailyRotateFile({
          filename: './logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
        }),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        // new winston.transports.File({ filename: '/logs/combined.log' }),
      ],
    }),
    AuthModule,
    HospitalModule,
    UserModule,
    SpecialistModule,
    PatientModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    StartupService,
    VaultService
  ],
  controllers: [AppController, ConnectionController, RegisterController],
})

export class AppModule {}