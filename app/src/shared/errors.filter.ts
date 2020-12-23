import {ArgumentsHost, Catch, HttpException, Logger, UnauthorizedException} from '@nestjs/common';
import {GqlArgumentsHost, GqlExceptionFilter} from '@nestjs/graphql';

@Catch(UnauthorizedException)
export class HttpExceptionFilter implements GqlExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const contextName = `HttpExceptionFilter`;
        const gqlHost = GqlArgumentsHost.create(host);
        Logger.error(`Error for operation: ${gqlHost.getInfo().operation.operation}; path: ${gqlHost.getInfo().path.key}`, contextName);
        Logger.error(`------------------With args-----------------`, contextName);
        Logger.error(gqlHost.getArgs(), contextName);
        return exception;
    }
}
