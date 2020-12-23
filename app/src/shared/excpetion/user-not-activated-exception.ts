import {BadRequestException} from '@nestjs/common';

export class UserNotActivatedException extends BadRequestException {}