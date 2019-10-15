const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

// Until we have default pagination, query will be too big and will fail
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('no filters', () => {
  test('omitted', async () => {
    const query = gql`
      {
        hills {
          name
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.length).toBeGreaterThan(0);
  });

  test('empty', async () => {
    const query = gql`
      {
        hills(filter: {}) {
          name
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.length).toBeGreaterThan(0);
  });
});

test('by country', async () => {
  const query = gql`
    {
      hills(filter: { countries: { code: "GB-ENG" } }) {
        name
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'Skiddaw' })])
  );
  expect(data.hills).toEqual(
    // On the England-Scotland border
    expect.arrayContaining([expect.objectContaining({ name: 'Windy Gyle' })])
  );
  expect(data.hills).toEqual(
    expect.not.arrayContaining([expect.objectContaining({ name: 'Ben Lomond' })])
  );
});

test('by list', async () => {
  const query = gql`
    {
      hills(filter: { lists: { id: WAINWRIGHT } }) {
        name
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills).toHaveLength(214);
  expect(data.hills).toEqual(
    // Wainwright only
    expect.arrayContaining([expect.objectContaining({ name: 'Bakestall' })])
  );
  expect(data.hills).toEqual(
    // Wainwright and Hewitt
    expect.arrayContaining([expect.objectContaining({ name: 'Skiddaw' })])
  );
  expect(data.hills).toEqual(
    expect.not.arrayContaining([expect.objectContaining({ name: 'Ben Lomond' })])
  );
});

test('by multiple fields', async () => {
  const query = gql`
    {
      hills(filter: { countries: { code: "GB-WAL" }, lists: { id: HEWITT } }) {
        name
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills).toHaveLength(136);
  expect(data.hills).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'Yr Aran' })])
  );
  expect(data.hills).toEqual(
    // Hewitt, but not in Wales
    expect.not.arrayContaining([expect.objectContaining({ name: 'Scafell' })])
  );
  expect(data.hills).toEqual(
    // In Wales, but not a Hewitt
    expect.not.arrayContaining([expect.objectContaining({ name: 'Yr Eifl' })])
  );
});
