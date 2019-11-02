const gql = require('./graphql-tag-raw');
const { sendQuery, sendQueryOk } = require('./helpers');

test('by primary name, ascending', async () => {
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

test('by height, descending', async () => {
  const query = gql`
    {
      hills(
        filter: { lists: { id: { inc: WAINWRIGHT } } }
        sort: { height: { descending: true } }
      ) {
        nodes {
          height(unit: METRES)
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills.nodes[0].height).toBe(978.07);
  expect(data.hills.nodes[1].height).toBe(963.9);
});

test('when paginating backward', async () => {
  const query = gql`
    {
      hills(
        filter: { lists: { id: { inc: WAINWRIGHT } } }
        sort: { namePrimary: { descending: false } }
        last: 2
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

  expect(data.hills.nodes[0].names.primary).toBe('Yewbarrow');
  expect(data.hills.nodes[1].names.primary).toBe('Yoke');
});

test('does not support sorting by multiple fields at once', async () => {
  const query = gql`
    {
      hills(sort: { height: {}, namePrimary: {} }) {
        nodes {
          names {
            primary
          }
        }
      }
    }
  `;

  const response = await sendQuery(query);

  expect(response.status).toBe(400);
  expect(response).toContainOneError('Sorting is only supported on one field at a time');
});

test('rejects unknown sort field', async () => {
  // Tests that the custom validation rules don't choke on objects of unknown types

  const query = gql`
    {
      hills(sort: { foo: {} }) {
        nodes {
          names {
            primary
          }
        }
      }
    }
  `;

  const response = await sendQuery(query);

  expect(response.status).toBe(400);
  expect(response).toContainOneError('Field "foo" is not defined by type HillSort.');
});
