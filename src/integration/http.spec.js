/**
 * Test the configuration and custom code.
 *
 * It's not necessary to test all cases of serving GraphQL over HTTP, as this
 * is the responsibility of express-graphql at the moment.
 */
const axios = require('axios').default;

const gql = require('./graphql-tag-raw');
const { endpoint, playground, schemaDump, sendQuery, sendQueryOk } = require('./helpers');

const query = gql`
  {
    hill(number: 278) {
      number
    }
  }
`;

test('GET', async () => {
  const response = await axios.get(endpoint, {
    params: {
      query,
    },
  });

  expect(response.status).toBe(200);
  expect(response.data.data.hill).toEqual({ number: 278 });
});

test('GET: conditional request using ETag', async () => {
  // This test will break when graphql-express pretty printing is enabled

  expect.assertions(2);

  const responseOne = await axios.get(endpoint, {
    params: {
      query,
    },
  });

  expect(responseOne.headers).toEqual(
    expect.objectContaining({ etag: expect.any(String) })
  );

  try {
    await axios.get(endpoint, {
      headers: {
        'If-None-Match': responseOne.headers.etag,
      },
      params: {
        query,
      },
    });
  } catch (error) {
    expect(error.response.status).toBe(304);
  }
});

test('caching: allowed for GET responses', async () => {
  const response = await axios.get(endpoint, {
    params: {
      query,
    },
  });

  expect(response.status).toBe(200);
  expect(response.headers).toEqual(
    expect.objectContaining({ 'cache-control': expect.stringContaining('max-age') })
  );
});

test('caching: not allowed for POST responses', async () => {
  const response = await sendQuery(query);

  expect(response.status).toBe(200);
  expect(response.headers).toEqual(
    expect.objectContaining({ 'cache-control': 'no-cache' })
  );
});

test('disallowed method', async () => {
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

test('POST: unsupported body content type', async () => {
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

test('query syntax error', async () => {
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

test('schema dump as plain text', async () => {
  const response = await axios.get(schemaDump);

  expect(response.status).toBe(200);
  expect(response.data).toMatch('type Query {');
});

test('playground is served', async () => {
  const response = await axios.get(playground);

  expect(response.status).toBe(200);
  expect(response.headers['content-type']).toMatch('text/html');
});

test('schema introspection is allowed (for playground)', async () => {
  const introspectionQuery = gql`
    {
      __schema {
        queryType {
          fields {
            name
          }
        }
      }
    }
  `;

  await sendQueryOk(introspectionQuery);
});
