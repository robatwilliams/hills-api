/* eslint-disable prefer-template */
const { matcherHint, printExpected, printReceived } = require('jest-matcher-utils');

function toContainOneError(response, expectedMessage) {
  if (this.isNot) {
    throw new Error('Negation not implemented for this matcher');
  }

  const pass =
    response.data.errors &&
    response.data.errors.length === 1 &&
    response.data.errors[0].message === expectedMessage;

  return { pass, message: () => failMessage(response.data.errors, expectedMessage) };
}

function failMessage(errors, expectedName) {
  return (
    matcherHint('.toContainOneError') +
    '\n\n' +
    `Expected one error with message: ${printExpected(expectedName)}\n` +
    `Received errors: ${printReceived(errors)}`
  );
}

module.exports = { toContainOneError };
