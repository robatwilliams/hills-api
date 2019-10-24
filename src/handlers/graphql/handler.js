const awsServerlessExpress = require('aws-serverless-express');

const { ensureSupportedContentType } = require('./helpers');
const app = require('./app');

const REQUEST_MEDIA_TYPES = ['application/json', 'application/graphql'];

// Proxy library to bridge the gap between AWS Lambda and Express
const server = awsServerlessExpress.createServer(app);

/**
 * https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 *
 * Event documentation:
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * https://docs.aws.amazon.com/lambda/latest/dg/with-on-demand-https.html
 *
 * @param {*} event API Gateway Lambda proxy integration representation of client request
 */
module.exports = async function handler(event, context) {
  let response = ensureSupportedContentType(event, REQUEST_MEDIA_TYPES);

  if (response) {
    return response;
  }

  response = await awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;

  if (event.httpMethod === 'GET') {
    response.headers['Cache-Control'] = 'max-age=86400';
  }

  return response;
};
