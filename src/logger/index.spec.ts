import { ConsoleLogger } from '@nestjs/common';

import { CustomLogger } from '.';

describe('ReqCompleteCheckerMiddleware', () => {
  const logger = new CustomLogger();
  const mockMessage = 'mock-message';
  const mockParam = 'mock-param';

  afterEach(() => {
    jest.clearAllMocks().restoreAllMocks().resetAllMocks();
  });

  it.each(['err', 'error'])(
    'should call super.error with the error stack for "%s" property',
    (errorProperty) => {
      const mockStack = 'mock-stack';
      const mockError = new Error('mock-error');
      mockError.stack = mockStack;

      const loggerErrorSpy = jest
        .spyOn(ConsoleLogger.prototype, 'error')
        .mockReturnValue(undefined);

      logger.error(mockMessage, { [errorProperty]: mockError, mockParam });

      expect(loggerErrorSpy).toHaveBeenCalledWith(mockMessage, {
        [errorProperty]: mockStack,
        mockParam,
      });
    },
  );

  it.each(['err', 'error'])(
    'should call super.error with the error made to string for "%s" property',
    (errorProperty) => {
      const mockError = new Error('mock-error');
      mockError.stack = undefined;
      const mockErrorString = mockError.toString();

      const loggerErrorSpy = jest
        .spyOn(ConsoleLogger.prototype, 'error')
        .mockReturnValue(undefined);

      logger.error(mockMessage, { [errorProperty]: mockError, mockParam });

      expect(loggerErrorSpy).toHaveBeenCalledWith(mockMessage, {
        [errorProperty]: mockErrorString,
        mockParam,
      });
    },
  );
});
