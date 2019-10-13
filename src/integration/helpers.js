const axios = require('axios').default;

const rootUrl = process.env.TEST_INTEGRATION_ROOT_URL;
const endpoint = `${rootUrl}/graphql`;
const playground = `${rootUrl}/playground`;

function sendQuery(query) {
  return axios.post(endpoint, query, {
    headers: { 'Content-Type': 'application/graphql' },
  });
}

async function sendQueryOk(query) {
  const response = await sendQuery(query);

  expect(response.status).toBe(200);

  // Unwrap the GraphQL response
  return response.data.data;
}

module.exports = {
  endpoint,
  playground,
  sendQuery,
  sendQueryOk,
};
