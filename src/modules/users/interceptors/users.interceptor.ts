import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, map } from 'rxjs';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UsersInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const requestId = Buffer.from(new Date().toISOString()).toString('base64');

    // log request
    this.logger.log(
      `(${requestId}) ${req.method} ${req.path} ${JSON.stringify(req.body)}`,
    );

    return next
      .handle()
      .pipe(
        map(async (value) => {
          // log successful response
          this.logger.log(`(${requestId}) ${JSON.stringify(value)}`);
          return value;
        }),
      )
      .pipe(
        catchError(async (err) => {
          // log error
          this.logger.error(`(${requestId}) ${JSON.stringify(err)}`);
          return err;
        }),
      );
  }
}
