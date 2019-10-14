const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

test('by number: found', async () => {
  const query = gql`
    {
      hill(number: 278) {
        number
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill).toMatchObject({ number: 278 });
});

test('by number: not found', async () => {
  const query = gql`
    {
      hill(number: 99999) {
        number
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill).toBeNull();
});

test('by number: negative', async () => {
  const query = gql`
    {
      hill(number: -100) {
        number
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill).toBeNull();
});
