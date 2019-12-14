const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

// Keep in sync with examples/all-fields.graphql
const allFieldsFragment = gql`
  {
    nodes {
      coordinates {
        geodetic {
          latitude
          longitude
        }
        grid {
          easting
          northing
          square
        }
      }
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
      names {
        alternates
        primary
      }
      number
      region {
        name
      }
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
  // Increase from default 5s, then restore default
  beforeEach(() => jest.setTimeout(10000));
  afterEach(() => jest.setTimeout());

  test('Birketts', async () => {
    await traverseEntireDataSet({ list: 'BIRKETT' });
  });

  test('Corbetts', async () => {
    await traverseEntireDataSet({ list: 'CORBETT' });
  });

  test('Donalds', async () => {
    await traverseEntireDataSet({ list: 'DONALD' });
  });

  test('Grahams', async () => {
    await traverseEntireDataSet({ list: 'GRAHAM' });
  });

  test('Hewitts', async () => {
    await traverseEntireDataSet({ list: 'HEWITT' });
  });

  test('Marilyns', async () => {
    jest.setTimeout(20000); // There are 2,011 of these

    await traverseEntireDataSet({ list: 'MARILYN' });
  });

  test('Munros', async () => {
    await traverseEntireDataSet({ list: 'MUNRO' });
  });

  test('Nuttalls', async () => {
    await traverseEntireDataSet({ list: 'NUTTALL' });
  });

  test('Wainwrights', async () => {
    await traverseEntireDataSet({ list: 'WAINWRIGHT' });
  });
});

/**
 * Avoid breaching API pagination limit.
 */
async function traverseEntireDataSet({ list }) {
  let previousPageInfo = { hasNextPage: true };

  while (previousPageInfo.hasNextPage) {
    const query = createQuery({
      list,
      first: 100,
      after: previousPageInfo.endCursor,
    });

    // eslint-disable-next-line no-await-in-loop
    const data = await sendQueryOk(query);

    previousPageInfo = data.hills.pageInfo;
  }
}

function createQuery({ list, first, after } = {}) {
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
