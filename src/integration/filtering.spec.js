const gql = require('./graphql-tag-raw');
const { sendQueryError, sendQueryOk } = require('./helpers');

describe('no filters', () => {
  test('omitted', async () => {
    const query = gql`
      {
        hills {
          nodes {
            names {
              primary
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.nodes.length).toBeGreaterThan(0);
  });

  test('empty', async () => {
    const query = gql`
      {
        hills(filter: {}) {
          nodes {
            names {
              primary
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.nodes.length).toBeGreaterThan(0);
  });
});

test('by country', async () => {
  const query = gql`
    {
      hills(filter: { countries: { code: { inc: "GB-ENG" } } }) {
        nodes {
          countries {
            name
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills.nodes.length).toBeGreaterThan(0);

  for (const hill of data.hills.nodes) {
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
          nodes {
            names {
              primary
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).toEqual([
      { names: { primary: 'Ben Nevis' } },
      { names: { primary: 'Ben Macdui' } },
    ]);
  });

  test('greater than or equal to, in feet', async () => {
    const query = gql`
      {
        # Braeriach is 4252ft
        hills(filter: { heightFeet: { gte: 4252 } }) {
          nodes {
            names {
              primary
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).toEqual([
      { names: { primary: 'Ben Nevis' } },
      { names: { primary: 'Ben Macdui' } },
      { names: { primary: 'Braeriach' } },
    ]);
  });

  test('using a decimal', async () => {
    const query = gql`
      {
        hills(filter: { heightMetres: { gt: 1344.5 } }) {
          nodes {
            names {
              primary
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).toEqual([{ names: { primary: 'Ben Nevis' } }]);
  });
});

test('by list', async () => {
  const query = gql`
    {
      hills(filter: { lists: { id: { inc: WAINWRIGHT } } }) {
        nodes {
          lists {
            id
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills.nodes.length).toBeGreaterThan(0);

  for (const hill of data.hills.nodes) {
    expect(hill.lists).toEqual(
      // It's ok to be in other lists too
      expect.arrayContaining([expect.objectContaining({ id: 'WAINWRIGHT' })])
    );
  }
});

describe('by names', () => {
  describe('word == term', () => {
    it('includes when name == term', async () => {
      const query = createQuery('Skiddaw');

      const data = await sendQueryOk(query);

      expect(data.hills.nodes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ names: { primary: 'Skiddaw' } }),
        ])
      );
    });

    it('includes when first word of name == term', async () => {
      const query = createQuery('Glyder');

      const data = await sendQueryOk(query);

      expect(data.hills.nodes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ names: { primary: 'Glyder Fach' } }),
        ])
      );
    });

    it('includes when middle word of name == term', async () => {
      const query = createQuery('Sca');

      const data = await sendQueryOk(query);

      expect(data.hills.nodes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ names: { primary: 'Great Sca Fell' } }),
        ])
      );
    });

    it('includes when last word of name == term', async () => {
      const query = createQuery('Blisco');

      const data = await sendQueryOk(query);

      expect(data.hills.nodes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ names: { primary: 'Pike of Blisco' } }),
        ])
      );
    });
  });

  describe('word starts with term', () => {
    it('includes when name starts with term', async () => {
      const query = createQuery('Skid');

      const data = await sendQueryOk(query);

      expect(data.hills.nodes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ names: { primary: 'Skiddaw' } }),
        ])
      );
    });

    it('includes when subsequent word of name starts with term', async () => {
      const query = createQuery('Sund');

      const data = await sendQueryOk(query);

      expect(data.hills.nodes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ names: { primary: 'St Sunday Crag' } }),
        ])
      );
    });
  });

  it('includes when match is on alternate name', async () => {
    const query = createQuery('Eel Crag');

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ names: { primary: 'Crag Hill' } }),
      ])
    );
  });

  it('does not include when word includes term later than the start', async () => {
    const query = createQuery('ben');

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ names: { primary: 'Scaraben' } }),
      ])
    );
  });

  it('is not case sensitive', async () => {
    const query = createQuery('skiddaw');

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).toEqual(
      expect.arrayContaining([expect.objectContaining({ names: { primary: 'Skiddaw' } })])
    );
  });

  function createQuery(searchTerm) {
    const fieldsFragment = gql`
      {
        nodes {
          names {
            primary
          }
        }
      }
    `;

    return gql`
      {
        hills(filter: { names: { search: "${searchTerm}" } }) ${fieldsFragment}
      }
    `;
  }
});

test('by region', async () => {
  const query = gql`
    {
      hills(filter: { region: { name: { eq: "Lake District N" } } }) {
        nodes {
          region {
            name
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills.nodes.length).toBeGreaterThan(0);

  for (const hill of data.hills.nodes) {
    expect(hill.region).toEqual({ name: 'Lake District N' });
  }
});

test('by multiple fields', async () => {
  const query = gql`
    {
      hills(
        filter: { countries: { code: { inc: "GB-WAL" } }, lists: { id: { inc: HEWITT } } }
      ) {
        nodes {
          countries {
            name
          }
          lists {
            id
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills.nodes.length).toBeGreaterThan(0);

  for (const hill of data.hills.nodes) {
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
        nodes {
          names {
            primary
          }
        }
      }
    }
  `;

  const response = await sendQueryError(400, query);

  expect(response).toContainOneError('Criterion must have an operator');
});
