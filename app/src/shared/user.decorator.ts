// user.decorator.ts
import {createParamDecorator, Logger} from '@nestjs/common';

export const User = createParamDecorator((data: string, req) => {
    const reqUserObject = req.find(reqObject => reqObject && reqObject.user && reqObject.headers);
    if (reqUserObject) {
        const user = reqUserObject.user;
        if (data && user && user[data]) {
            return user[data];
        }
        if (user) {
            return user;
        }
    }
    Logger.error(`User or CurrentUser decorator used not properly`);
    return null;
});
