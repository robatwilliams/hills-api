const log = require('../../log');

const { isAuroraServerlessPausedError } = require('./helpers');

module.exports = function errorLogger(error) {
  if (isClientError(error) || isAuroraServerlessPausedError(error)) {
    // No full error logging for these; query logging is enough
    return;
  }

  log.error('Error while executing query', error);
};

function isClientError({ message, status }) {
  return (
    // From express-graphql
    (status != null && status >= 400 && status < 500) ||
    // From graphql-js. There are others but this is expected to be most frequent.
    (message && message.startsWith('Syntax Error'))
  );
}
