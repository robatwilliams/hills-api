const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

test('countries', async () => {
  const query = gql`
    {
      countries {
        code
        name
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.countries.length).toBeGreaterThan(0);
  expect(data.countries).toContainEqual({ code: 'GB-SCT', name: 'Scotland' });

  for (const country of data.countries) {
    expect(country.code).toMatch(/^[A-Z-]+$/u);
    expect(country.name).toMatch(/^[A-Z][\w ]+$/u);
  }
});

test('lists', async () => {
  const query = gql`
    {
      lists {
        name
        id
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.lists.length).toBeGreaterThan(0);
  expect(data.lists).toContainEqual({ name: 'Munro', id: 'MUNRO' });

  for (const list of data.lists) {
    expect(list.id).toMatch(/^[A-Z]+$/u);
    expect(list.name).toMatch(/^[A-Z][a-z]+$/u);
  }
});

test('regions', async () => {
  const query = gql`
    {
      regions {
        name
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.regions).toHaveLength(139);
  expect(data.regions[0].name).toBe('Shetland Islands');
});
