const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

describe('countries', () => {
  test('name', async () => {
    const query = gql`
      {
        hill(number: 278) {
          countries {
            name
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.countries[0].name).toBe('Scotland');
  });

  test('multiple; straddling border', async () => {
    const query = gql`
      {
        hill(number: 2308) {
          countries {
            name
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.countries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'England' }),
        expect.objectContaining({ name: 'Scotland' }),
      ])
    );
  });
});

describe('height', () => {
  test('in metres', async () => {
    const query = gql`
      {
        hill(number: 278) {
          height(unit: METRES)
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.height).toBe(1344.53);
  });

  test('in feet', async () => {
    const query = gql`
      {
        hill(number: 278) {
          height(unit: FEET)
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.height).toBe(4411);
  });
});

describe('lists', () => {
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
});

describe('maps', () => {
  test('appearing only on one', async () => {
    const query = gql`
      {
        hill(number: 2320) {
          maps(scale: ONE_50K) {
            sheet
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.maps).toEqual([{ sheet: '90' }]);
  });

  test('appearing on multiple', async () => {
    const query = gql`
      {
        hill(number: 2405) {
          maps(scale: ONE_50K) {
            sheet
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.maps).toEqual([{ sheet: '89' }, { sheet: '90' }]);
  });

  test('OL Explorer sub-series', async () => {
    const query = gql`
      {
        hill(number: 2412) {
          maps(scale: ONE_25K) {
            sheet
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.maps).toEqual([{ sheet: 'OL4' }]);
  });

  test('sheet number omits location-on-sheet suffix present in source data', async () => {
    const query = gql`
      {
        hill(number: 2412) {
          maps(scale: ONE_25K) {
            sheet
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    // Source data: "OL4S"
    expect(data.hill.maps).toEqual([{ sheet: 'OL4' }]);
  });

  test('no duplicate sheet when sheet number listed twice in source data with location suffix', async () => {
    const query = gql`
      {
        hill(number: 71) {
          maps(scale: ONE_25K) {
            sheet
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    // Source data: "OL39N OL39S 364N 364S"
    expect(data.hill.maps).toEqual([{ sheet: '364' }, { sheet: 'OL39' }]);
  });

  test('Ireland 1:50k - Discovery Series by OS Ireland', async () => {
    const query = gql`
      {
        hill(number: 20001) {
          maps(scale: ONE_50K) {
            sheet
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.maps).toEqual([{ sheet: '78' }]);
  });

  test('Ireland missing 1:25k maps', async () => {
    const query = gql`
      {
        hill(number: 20001) {
          maps(scale: ONE_25K) {
            sheet
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.maps).toHaveLength(0);
  });
});

describe('names', () => {
  test('single simple', async () => {
    const query = gql`
      {
        hill(number: 2319) {
          names
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.names).toEqual(['Skiddaw']);
  });

  test('single with disambiguation', async () => {
    const query = gql`
      {
        hill(number: 2643) {
          names
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.names).toEqual(['Harter Fell (Eskdale)']);
  });

  test('multiple', async () => {
    const query = gql`
      {
        hill(number: 2374) {
          names
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill.names).toEqual(['Crag Hill', 'Eel Crag']);

    // There are also hills with 3 and 4 names
  });
});
