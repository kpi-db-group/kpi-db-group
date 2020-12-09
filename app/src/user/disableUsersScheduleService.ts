import { Injectable, Logger } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { UserService } from './service/user.service';

@Injectable()
export class DisableUsersScheduleService extends NestSchedule {

  constructor(
    private readonly userService: UserService
  ) {
    super();
  }

  @Cron('*/5 * * * *', {key: 'disable-user'})
  async cronJob() {
    await this.userService.getAllEnabledUsers().then(users => {
      users.forEach(user => {
        if (user.dateOfDeactivation && (+user.dateOfDeactivation + 7 * 86400000 < +Date.now())) {
          this.userService.updateUser(user._id, {enabled: false});
        }
      })
    }).catch((err) => {
      Logger.error(`An error occurred while disable user`);
      Logger.error(err);
    });
  }
}
