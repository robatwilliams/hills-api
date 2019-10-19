const gql = require('./graphql-tag-raw');
const { extractHillNodes, sendQueryError, sendQueryOk } = require('./helpers');

describe('no filters', () => {
  test('omitted', async () => {
    const query = gql`
      {
        hills {
          edges {
            node {
              name
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.edges.length).toBeGreaterThan(0);
  });

  test('empty', async () => {
    const query = gql`
      {
        hills(filter: {}) {
          edges {
            node {
              name
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.edges.length).toBeGreaterThan(0);
  });
});

test('by country', async () => {
  const query = gql`
    {
      hills(filter: { countries: { code: { inc: "GB-ENG" } } }) {
        edges {
          node {
            countries {
              name
            }
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);
  const hills = extractHillNodes(data);

  for (const hill of hills) {
    expect(hill.countries).toEqual(
      // It's ok to be in other countries too - border hills
      expect.arrayContaining([expect.objectContaining({ name: 'England' })])
    );
  }
});

describe('by height', () => {
  test('greater than, in metres', async () => {
    const query = gql`
      {
        # Braeriach is 1296m
        hills(filter: { heightMetres: { gt: 1296 } }) {
          edges {
            node {
              name
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);
    const hills = extractHillNodes(data);

    expect(hills).toEqual([
      { name: 'Ben Nevis [Beinn Nibheis]' },
      { name: 'Ben Macdui [Beinn Macduibh]' },
    ]);
  });

  test('greater than or equal to, in feet', async () => {
    const query = gql`
      {
        # Braeriach is 4252ft
        hills(filter: { heightFeet: { gte: 4252 } }) {
          edges {
            node {
              name
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);
    const hills = extractHillNodes(data);

    expect(hills).toEqual([
      { name: 'Ben Nevis [Beinn Nibheis]' },
      { name: 'Ben Macdui [Beinn Macduibh]' },
      { name: 'Braeriach' },
    ]);
  });
});

test('by list', async () => {
  const query = gql`
    {
      hills(filter: { lists: { id: { inc: WAINWRIGHT } } }) {
        edges {
          node {
            lists {
              id
            }
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);
  const hills = extractHillNodes(data);

  for (const hill of hills) {
    expect(hill.lists).toEqual(
      // It's ok to be in other lists too
      expect.arrayContaining([expect.objectContaining({ id: 'WAINWRIGHT' })])
    );
  }
});

test('by multiple fields', async () => {
  const query = gql`
    {
      hills(
        filter: { countries: { code: { inc: "GB-WAL" } }, lists: { id: { inc: HEWITT } } }
      ) {
        edges {
          node {
            countries {
              name
            }
            lists {
              id
            }
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);
  const hills = extractHillNodes(data);

  for (const hill of hills) {
    expect(hill.countries).toEqual(
      // It's ok to be in other countries too - border hills
      expect.arrayContaining([expect.objectContaining({ name: 'Wales' })])
    );

    expect(hill.lists).toEqual(
      // It's ok to be in other lists too
      expect.arrayContaining([expect.objectContaining({ id: 'HEWITT' })])
    );
  }
});

test('invalid criterion', async () => {
  // No operator specified. Unit tests cover other cases.
  const query = gql`
    {
      hills(filter: { countries: { code: {} } }) {
        edges {
          node {
            name
          }
        }
      }
    }
  `;

  const errors = await sendQueryError(400, query);

  expect(errors).toEqual([
    expect.objectContaining({ message: 'Criterion must have an operator' }),
  ]);
});
