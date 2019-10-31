/**
 * 1. Prevent requests with unsupported types proceeding further
 * 2. Better status and error message if content type is missing
 *      (not 400 "Must provide query string")
 */
function ensureSupportedContentType(event, supportedTypes) {
  if (event.httpMethod !== 'POST') {
    return undefined;
  }

  // API Gateway normalises to lowercase, serverless-offline does not
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

  if (supportedTypes.includes(contentType)) {
    return undefined;
  }

  return {
    statusCode: 415,
    body: JSON.stringify({
      errors: [{ message: `Supports: ${supportedTypes.join(', ')}` }],
    }),
  };
}

function isAuroraServerlessPausedError({ message }) {
  return message.startsWith('Communications link failure');
}

module.exports = {
  ensureSupportedContentType,
  isAuroraServerlessPausedError,
};
