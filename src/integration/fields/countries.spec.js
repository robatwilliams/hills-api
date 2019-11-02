const gql = require('../graphql-tag-raw');
const { sendQueryOk } = require('../helpers');

test('name', async () => {
  const query = gql`
    {
      hill(number: 278) {
        countries {
          name
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.countries[0].name).toBe('Scotland');
});

test('multiple; straddling border', async () => {
  const query = gql`
    {
      hill(number: 2308) {
        countries {
          name
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.countries).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'England' }),
      expect.objectContaining({ name: 'Scotland' }),
    ])
  );
});
