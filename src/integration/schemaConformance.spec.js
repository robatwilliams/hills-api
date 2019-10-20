const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

const allFieldsFragment = gql`
  {
    nodes {
      countries {
        code
        name
      }
      heightFeet: height(unit: FEET)
      heightMetres: height(unit: METRES)
      lists {
        id
        name
      }
      maps25: maps(scale: ONE_25K) {
        sheet
      }
      maps50: maps(scale: ONE_50K) {
        sheet
      }
      name
      number
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
`;

/**
 * Test per-list, for granularity and convenience when adding new lists. It would
 * otherwise be quicker to test in one pass, as many hills appear on multiple lists.
 */
describe('all hill lists', () => {
  test('Birketts', async () => {
    const query = createQuery({ list: 'BIRKETT' });

    await sendQueryOk(query);
  });

  test('Corbetts', async () => {
    const query = createQuery({ list: 'CORBETT' });

    await sendQueryOk(query);
  });

  test('Donalds', async () => {
    const query = createQuery({ list: 'DONALD' });

    await sendQueryOk(query);
  });

  test('Grahams', async () => {
    const query = createQuery({ list: 'GRAHAM' });

    await sendQueryOk(query);
  });

  test('Hewitts', async () => {
    const query = createQuery({ list: 'HEWITT' });

    await sendQueryOk(query);
  });

  test('Marilyns', async () => {
    const queryCount = await traverseEntireDataSet({
      list: 'MARILYN',
      first: 500,
    });

    // There are 2,011 of them
    expect(queryCount).toBe(5);
  });

  test('Munros', async () => {
    const query = createQuery({ list: 'MUNRO' });

    await sendQueryOk(query);
  });

  test('Nuttalls', async () => {
    const query = createQuery({ list: 'NUTTALL' });

    await sendQueryOk(query);
  });

  test('Wainwrights', async () => {
    const query = createQuery({ list: 'WAINWRIGHT' });

    await sendQueryOk(query);
  });
});

/**
 * Avoid breaching RDS API record count (1,000) / data size (1MB) limits.
 */
async function traverseEntireDataSet(baseQueryOptions) {
  let queryCount = 0;
  let previousPageInfo = { hasNextPage: true };

  while (previousPageInfo.hasNextPage) {
    queryCount++;
    const queryOptions = {
      ...baseQueryOptions,
      after: previousPageInfo.endCursor,
    };

    const query = createQuery(queryOptions);

    // eslint-disable-next-line no-await-in-loop
    const data = await sendQueryOk(query);

    previousPageInfo = data.hills.pageInfo;
  }

  return queryCount;
}

function createQuery({ list, first = 1000, after } = {}) {
  return gql`
    {
      hills(
        filter: { lists: { id: { inc: ${list} } } }
        first: ${first}
        ${after == null ? '' : `after: "${after}"`}
      )
      ${allFieldsFragment}
    }
  `;
}
