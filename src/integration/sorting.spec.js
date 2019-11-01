const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

test('by primary name', async () => {
  const query = gql`
    {
      hills(
        filter: { lists: { id: { inc: WAINWRIGHT } } }
        sort: { namePrimary: { descending: false } }
      ) {
        nodes {
          names {
            primary
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills.nodes[0].names.primary).toBe('Allen Crags');
  expect(data.hills.nodes[1].names.primary).toBe('Angletarn Pikes');
});

test('descending', async () => {
  const query = gql`
    {
      hills(
        filter: { lists: { id: { inc: WAINWRIGHT } } }
        sort: { namePrimary: { descending: true } }
      ) {
        nodes {
          names {
            primary
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills.nodes[0].names.primary).toBe('Yoke');
  expect(data.hills.nodes[1].names.primary).toBe('Yewbarrow');
});
