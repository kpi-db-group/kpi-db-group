import {BadRequestException} from '@nestjs/common';

export class RestoringTokenExpiredException extends BadRequestException {}
