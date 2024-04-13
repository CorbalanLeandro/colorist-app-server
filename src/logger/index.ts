import { ConsoleLogger } from '@nestjs/common';
import { inspect } from 'util';

interface ILogObjectWithError {
  [key: string]: any;
  err: any;
  error: any;
}

export class CustomLogger extends ConsoleLogger {
  error(message: any, ...optionalParams: [...any]): void {
    try {
      const logObjectWithErrorIndex = optionalParams.findIndex(
        (p) => p?.hasOwnProperty('err') || p?.hasOwnProperty('error'),
      );

      const logObjectWithError: ILogObjectWithError | undefined =
        logObjectWithErrorIndex !== -1
          ? optionalParams.splice(logObjectWithErrorIndex, 1)[0]
          : undefined;

      if (logObjectWithError) {
        const { err: pureErr, error: pureError } = logObjectWithError;

        const err = pureErr ? inspect(pureErr) : undefined;
        const error = pureError ? inspect(pureError) : undefined;

        logObjectWithError.err = err;
        logObjectWithError.error = error;

        // log object must be first
        optionalParams.unshift(logObjectWithError);
      }
    } catch (err) {
      console.error(
        { err, optionalParams },
        'Cannot serialize the error object on the log',
      );
    }

    super.error(message, ...optionalParams);
  }
}
