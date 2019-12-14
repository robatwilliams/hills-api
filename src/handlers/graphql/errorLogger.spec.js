const { syntaxError } = require('graphql');

const log = require('../../log');

const errorLogger = require('./errorLogger');

jest.mock('../../log', () => ({
  error: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

it('does not log client errors: arising in express-graphql', () => {
  const clientError = new Error('POST body sent invalid JSON.');
  clientError.status = 400;

  errorLogger(clientError);

  expect(log.error).not.toHaveBeenCalled();
});

it('does not log client errors: syntax error', () => {
  errorLogger(syntaxError());

  expect(log.error).not.toHaveBeenCalled();
});

it('does not log error caused by Aurora Serverless being paused', () => {
  errorLogger(new Error('Communications link failure\n\nThe last packet'));

  expect(log.error).not.toHaveBeenCalled();
});

it('logs server errors arising in express-graphql', () => {
  const serverError = new Error('Internal Error');
  serverError.status = 500;

  errorLogger(serverError);

  expect(log.error).toHaveBeenCalled();
});

it('logs errors not having a distinguishing status', () => {
  errorLogger(new ReferenceError('foo is not defined'));

  expect(log.error).toHaveBeenCalledTimes(1);
});
