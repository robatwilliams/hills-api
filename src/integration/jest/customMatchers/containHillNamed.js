/* eslint-disable prefer-template */
const { matcherHint, printExpected, printReceived } = require('jest-matcher-utils');

function toContainHillNamed(response, expectedName) {
  const graphQLData = response.data.data;

  const pass =
    graphQLData &&
    graphQLData.hills.nodes.find(hill => hill.names.primary === expectedName) != null;

  if (pass) {
    return { pass, message: () => passMessage(graphQLData, expectedName) };
  }

  return { pass, message: () => failMessage(graphQLData, expectedName) };
}

function passMessage(data, expectedName) {
  return (
    matcherHint('.not.toContainHillNamed') +
    '\n\n' +
    `Expected hill named: not ${printExpected(expectedName)}\n` +
    `Received data: ${printReceived(data)}`
  );
}

function failMessage(data, expectedName) {
  return (
    matcherHint('.toContainHillNamed') +
    '\n\n' +
    `Expected hill named: ${printExpected(expectedName)}\n` +
    `Received data: ${printReceived(data)}`
  );
}

module.exports = { toContainHillNamed };
