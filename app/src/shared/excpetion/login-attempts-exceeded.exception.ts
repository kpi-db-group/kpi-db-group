import {BadRequestException} from '@nestjs/common';

export class LoginAttemptsExceededException extends BadRequestException {}
