const { isAuroraServerlessPausedError } = require('./helpers');

module.exports = function customHttpStatus({ result }) {
  if (!result.errors) {
    return;
  }

  const customError = auroraServerlessPaused(result.errors);

  if (customError) {
    throw customError;
  }
};

function auroraServerlessPaused(errors) {
  if (!errors.some(isAuroraServerlessPausedError)) {
    return undefined;
  }

  const error = new Error(
    'Temporarily unavailable while the database resumes from sleep'
  );
  error.status = 503; // Service Unavailable

  return error;
}
