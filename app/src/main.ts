import 'dotenv/config';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { Logger } from '@nestjs/common';
import {HttpExceptionFilter} from './shared/errors.filter';
import { join } from 'path';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { NotFoundExceptionFilter } from './shared/notfound.filter';
import * as fs from 'fs';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as bodyParser from 'body-parser';
import { VaultService } from './vault/vault.service';
import { ConfigService } from './config.service'
import { CustomNodeJsGlobal } from './shared/custom.interface';
declare const global: CustomNodeJsGlobal;

async function bootstrap() {
  const configService = new ConfigService(new VaultService())
  await configService.storeVariablesInMemory()
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );
  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  };
  app.enableCors(options);
  app.useGlobalFilters(new HttpExceptionFilter(), new NotFoundExceptionFilter());

  await app.init();

  http.createServer(server).listen(global.config.network.HTTPPORT);
  Logger.log(`Server running on http://localhost:${global.config.network.HTTPPORT}`, 'Bootstrap');
}
bootstrap();
