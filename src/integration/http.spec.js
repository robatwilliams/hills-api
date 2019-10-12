/**
 * Test the configuration and custom code.
 *
 * It's not necessary to test all cases of serving GraphQL over HTTP, as this
 * is the responsibility of express-graphql at the moment.
 */
const axios = require('axios').default;

const { endpoint, playground, sendQuery, sendQueryOk } = require('./helpers');

const query = `{
  hill(number: 278) { number }
}`;

test('GET', async () => {
  const response = await axios.get(endpoint, {
    params: {
      query,
    },
  });

  expect(response.status).toBe(200);
  expect(response.data.data.hill).toEqual({ number: 278 });
});

test('not allowed method', async () => {
  expect.assertions(1);

  try {
    await axios.put(endpoint, query, {
      headers: { 'Content-Type': 'application/graphql' },
    });
  } catch (error) {
    const { response } = error;
    const isServerlessOffline = endpoint.includes('localhost');

    if (isServerlessOffline) {
      expect(response.status).toBe(415);
    } else {
      expect(response.status).toBe(403); // "Missing Authentication Token"
    }
  }
});

test('unsupported POST body content type', async () => {
  expect.assertions(2);

  try {
    await axios.post(endpoint, query, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  } catch (error) {
    const { response } = error;

    expect(response.status).toBe(415);
    expect(response.data.errors).toEqual([
      { message: 'Supports: application/json, application/graphql' },
    ]);
  }
});

test('query syntax error gives 400', async () => {
  const malformedQuery = `{
    hill(number: 278) { number
  }`;

  expect.assertions(2);

  try {
    await sendQuery(malformedQuery);
  } catch (error) {
    const { response } = error;

    expect(response.status).toBe(400);
    expect(response.data.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining('Syntax Error'),
        }),
      ])
    );
  }
});

test('playground is served', async () => {
  const response = await axios.get(playground);

  expect(response.status).toBe(200);
  expect(response.headers['content-type']).toMatch('text/html');
});

test('schema introspection is allowed (for playground)', async () => {
  const introspectionQuery = `{
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }`;

  await sendQueryOk(introspectionQuery);
});
