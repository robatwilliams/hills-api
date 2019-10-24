/* eslint-disable no-console */

// No log levels on CloudWatch, so prefix.
function createLog(prefix) {
  return function log(first, ...rest) {
    if (typeof first !== 'string') {
      console.log(prefix, first, ...rest);
    }

    console.log(`${prefix} ${first}`, ...rest);
  };
}

module.exports = {
  info: createLog('INFO '),
  warn: createLog('WARN '),
  error: createLog('ERROR'),
};
