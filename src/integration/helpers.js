// Use fail() in this file to avoid interfering with a test's expect.assertions()
/* global fail */
/* eslint-disable jest/no-jasmine-globals */
const axios = require('axios').default;

const rootUrl = process.env.TEST_INTEGRATION_ROOT_URL;
const endpoint = `${rootUrl}/graphql`;
const schemaDump = `${rootUrl}/schema`;
const playground = `${rootUrl}/playground`;

async function sendQuery(query) {
  try {
    return await axios.post(endpoint, query, {
      headers: { 'Content-Type': 'application/graphql' },
    });
  } catch (error) {
    return error.response;
  }
}

async function sendQueryOk(query) {
  const response = await sendQuery(query);

  if (response.status !== 200) {
    // eslint-disable-next-line no-console
    console.error(response);
    fail(`Expected status 200, but received ${response.status}`);
  }

  const { data, errors } = response.data;

  if (errors) {
    // eslint-disable-next-line no-console
    console.error(errors);
    fail('Errors in the response body');
  }

  return data;
}

module.exports = {
  endpoint,
  playground,
  schemaDump,

  sendQuery,
  sendQueryOk,
};
