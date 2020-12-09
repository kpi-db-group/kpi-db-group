import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'winston';
import * as fs from 'fs';
import { ApiResponse, ApiImplicitQuery, ApiImplicitBody, ApiUseTags } from '@nestjs/swagger';
import { CustomNodeJsGlobal } from './shared/custom.interface';
declare const global: CustomNodeJsGlobal;

@ApiUseTags('App')
@Controller()
export class AppController {

  constructor(
    @Inject('winston') private readonly logger: Logger,
  ) {
  }

  @Get()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Ok.', type: ApiSuccess })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Not Ok.', type: ApiException })
  ping() {
    return {ping: 'pong'};
  }

}
