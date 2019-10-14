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
      hills(filter: { countryCode: "GB-ENG" }) {
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
      hills(filter: { listId: WAINWRIGHT }) {
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
