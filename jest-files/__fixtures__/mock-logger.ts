import { Logger } from '@nestjs/common';

class LoggerFake extends Logger {
  log(message: string) {
    return;
  }

  error(message: string, trace: string) {
    return;
  }

  warn(message: string) {
    return;
  }

  debug(message: string) {
    return;
  }

  verbose(message: string) {
    return;
  }
}

function mockLogger() {
  jest.mock('@nestjs/common', () => ({
    ...jest.requireActual('@nestjs/common'),
    Logger: LoggerFake,
  }));
}

mockLogger();
