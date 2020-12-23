import { Controller, Get, Inject, Param, Render, Body, Post, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service'
import { Logger } from 'winston';
import { WrongMarkException } from '../shared/excpetion/wrong-mark.exception';
import {UserService} from '../user/service/user.service';
import { ApiImplicitQuery, ApiUseTags, ApiResponse } from '@nestjs/swagger';
const dataset = require('../shared/dataset.js')
import { CustomNodeJsGlobal } from '../shared/custom.interface';
declare const global: CustomNodeJsGlobal;

@ApiUseTags('Auth')
@Controller()
export class AuthController {

    constructor(
      private authService: AuthService,
      private userService: UserService,
      @Inject('winston') private readonly logger: Logger,
      ) {
    }

    @Get('unsubscribe/:emailToken')
    @ApiImplicitQuery({ name: 'emailToken', type: String })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Unsubscribed from email successfully.', type: ApiSuccess})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error.', type: ApiException })
    async unsubscribeFromEmail(@Param('emailToken') emailToken) {
      const title = `Unsubscribe from email`;
      try {
        const email = await this.authService.unsubscribe(emailToken);
        if (email) {
          this.logger.log({
            level: 'info',
            message: `Unsubscribe from email for address ${email} successfully!`,
          });
          return { message: `Unsubscribe from email for address ${email} successfully!`, title};
        } else {
          this.logger.log({
            level: 'info',
            message: `Link is invalid. User with this email not found!`,
          });
          return { message: `Link is invalid. User with this email not found!`};
        }
      } catch (err) {
        this.logger.log({
          level: 'error',
          message: err,
        });
        return { code: 500, message: `INTERNAL SERVER ERROR`, title};
      }
    }

    @Get('setPassword/:mark/:lang')
    @ApiImplicitQuery({ name: 'mark', type: String })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Set password successfully.', type: ApiSuccess})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error.', type: ApiException })
    async setPassword(@Param('mark') mark, @Param('postfix') postfix = global.config.network.POSTFIX, @Param('lang') lang, @Res() res) {
      const {title, markError, expiredError, congratulations, formPassword, formEmail, link, passwordNote, match, confirm, password } = dataset[lang]
      if (mark) {
        const userByMark = await this.userService.findUserById(mark.slice(0, 24));
        if (userByMark && userByMark.markCreateDate) {
          if (+userByMark.markCreateDate + 86400000 > Date.now()) {
            return { mark, postfix, title, congratulations, formPassword, formEmail, link, passwordNote, match, confirm, password }
          } else {
            return { error: expiredError, exp: true, title , mark: mark}
          }
        } else {
          return { error: markError, title }
        }
      } else {
        return { error: markError, title }
      }
    }

    @Post('applyPasswordToUser')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Password applyed successfully.', type: ApiSuccess})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error.', type: ApiException })
    async applyPasswordToUser(@Body() body: ApplyDto) {
      if (body.mark) {
        return await this.authService.applyPasswordToUser(body);
      } else {
         return { error: `Error. Validation failed. Inconsistent input provided. Please chech mark ${body.mark}` }
       }
    }
}
