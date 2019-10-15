const gql = require('./graphql-tag-raw');
const { sendQueryError, sendQueryOk } = require('./helpers');

test('no operators', async () => {
  const query = gql`
    {
      hills(filter: { countries: { code: {} } }) {
        name
      }
    }
  `;

  const errors = await sendQueryError(400, query);

  expect(errors).toEqual([
    expect.objectContaining({ message: 'Criterion must have an operator' }),
  ]);
});

test('includes', async () => {
  const query = gql`
    {
      hills(filter: { countries: { code: { inc: "GB-WAL" } } }) {
        name
      }
    }
  `;

  await sendQueryOk(query);
});
