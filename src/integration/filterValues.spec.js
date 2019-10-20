const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

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
