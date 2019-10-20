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

/**
 * For schema conformance integration tests; they don't need the data, just need
 * to pull it through the server's GraphQL schema checks.
 */
function omitResponseBody(response) {
  if (response.statusCode === 200 && !response.body.includes('error')) {
    response.body = undefined;
    response.headers['content-length'] = 0;
  }
}

module.exports = {
  ensureSupportedContentType,
  omitResponseBody,
};
