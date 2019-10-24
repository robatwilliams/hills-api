// Use fail() in this file to avoid interfering with a test's expect.assertions()
/* global fail */
/* eslint-disable jest/no-jasmine-globals */
const axios = require('axios').default;

const rootUrl = process.env.TEST_INTEGRATION_ROOT_URL;
const endpoint = `${rootUrl}/graphql`;
const schemaDump = `${rootUrl}/schema`;
const playground = `${rootUrl}/playground`;

function sendQuery(query) {
  return axios.post(endpoint, query, {
    headers: { 'Content-Type': 'application/graphql' },
  });
}

async function sendQueryOk(query) {
  const response = await sendQuery(query);

  if (response.status !== 200) {
    console.error(response);
    fail(`Expected status 200, but received ${response.status}`);
  }

  const { data, errors } = response.data;

  if (errors) {
    console.error(errors);
    fail('Errors in the response body');
  }

  return data;
}

async function sendQueryError(expectStatus, query) {
  try {
    const response = await sendQuery(query);
    console.log(response.data);
    fail('Query unexpectedly succeeded');
  } catch (error) {
    const { response } = error;

    if (response.status !== expectStatus) {
      fail(`Expected status ${expectStatus}, but received ${response.status}`);
    }

    // Unwrap the GraphQL response
    return response.data.errors;
  }

  return undefined;
}

module.exports = {
  endpoint,
  playground,
  schemaDump,

  sendQuery,
  sendQueryError,
  sendQueryOk,
};
