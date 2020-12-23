import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';

@Injectable()
export class StartupService implements OnApplicationBootstrap {

    onApplicationBootstrap(): any {
        Logger.debug(`Application started and data prepared`);
    }
}
