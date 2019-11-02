const gql = require('../graphql-tag-raw');
const { sendQueryOk } = require('../helpers');

test('name', async () => {
  const query = gql`
    {
      hill(number: 2423) {
        lists {
          name
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.lists).toEqual(expect.arrayContaining([{ name: 'Wainwright' }]));
});

test('multiple', async () => {
  const query = gql`
    {
      hill(number: 2320) {
        lists {
          id
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.lists).toEqual(
    expect.arrayContaining([{ id: 'WAINWRIGHT' }, { id: 'HEWITT' }])
  );
});
