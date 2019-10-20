const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

describe('all hill lists', () => {
  test('Hewitts', async () => {
    const query = createQuery({ list: 'HEWITT' });

    await sendQueryOk(query, { omitResponseBody: true });
  });

  test('Munros', async () => {
    const query = createQuery({ list: 'MUNRO' });

    await sendQueryOk(query, { omitResponseBody: true });
  });

  test('Wainwrights', async () => {
    const query = createQuery({ list: 'WAINWRIGHT' });

    await sendQueryOk(query, { omitResponseBody: true });
  });
});

function createQuery({ list, first = 1000, last } = {}) {
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
    }
  `;

  return gql`
    {
      hills(
        filter: { lists: { id: { inc: ${list} } } }
        ${first == null ? '' : `first: ${first}`}
        ${last == null ? '' : `last: ${last}`}
      )
      ${allFieldsFragment}
    }
  `;
}
