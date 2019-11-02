const gql = require('../graphql-tag-raw');
const { sendQueryOk } = require('../helpers');

test('single simple', async () => {
  const query = gql`
    {
      hill(number: 2319) {
        names {
          alternates
          primary
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.names.primary).toBe('Skiddaw');
  expect(data.hill.names.alternates).toHaveLength(0);
});

test('single with disambiguation', async () => {
  const query = gql`
    {
      hill(number: 2643) {
        names {
          alternates
          primary
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.names.primary).toBe('Harter Fell (Eskdale)');
  expect(data.hill.names.alternates).toHaveLength(0);
});

test('multiple', async () => {
  const query = gql`
    {
      hill(number: 2374) {
        names {
          alternates
          primary
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.names.primary).toBe('Crag Hill');
  expect(data.hill.names.alternates).toEqual(['Eel Crag']);

  // There are also hills with 3 and 4 names
});
