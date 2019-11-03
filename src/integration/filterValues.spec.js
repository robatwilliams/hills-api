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
  expect(data.countries).toSatisfyAll(
    country => /^[A-Z-]+$/u.test(country.code) && /^[A-Z][\w ]+$/u.test(country.name)
  );
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
  expect(data.lists).toSatisfyAll(
    list => /^[A-Z]+$/u.test(list.id) && /^[A-Z][a-z]+$/u.test(list.name)
  );
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
