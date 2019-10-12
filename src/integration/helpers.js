const axios = require('axios').default;

const endpoint = 'http://localhost:3000/graphql';
const playground = 'http://localhost:3000/playground';

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
