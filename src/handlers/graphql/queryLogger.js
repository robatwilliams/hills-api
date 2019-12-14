const { print } = require('graphql');

const log = require('../../log');

module.exports = function queryLogger(info) {
  const { document, variables, operationName, result, context } = info;

  const commonDetails = {
    operationName,
    query: print(document),
    executionTimeMs: Date.now() - context.startTime,
    variables,
  };

  if (result.errors) {
    const errorMessages = result.errors.map(error => error.message);

    // Warn only; it may well be the client's fault
    log.warn('Query completed with errors', { ...commonDetails, errorMessages });
  } else {
    log.info('Query completed successfully', commonDetails);
  }
};
