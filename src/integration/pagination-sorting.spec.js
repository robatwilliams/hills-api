const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');
const { createQuery } = require('./pagination.spec');

test('going forward when sorting by a column having unique values', async () => {
  const queryOptions = {
    sort: gql`{ namePrimary: { descending: false } }`,
    first: 2,
  };

  let data = await sendQueryOk(createQuery(queryOptions));

  // First page
  expectNames(['Allen Crags', 'Angletarn Pikes'], data);

  data = await sendQueryOk(
    createQuery({ ...queryOptions, after: data.hills.pageInfo.endCursor })
  );

  // Second page follows first
  expectNames(['Ard Crags', 'Armboth Fell'], data);

  data = await sendQueryOk(
    createQuery({ ...queryOptions, after: data.hills.pageInfo.endCursor })
  );

  // Third page, we don't want to see anything we've seen before
  expectNames(['Arnison Crag', "Arthur's Pike"], data);
});

test('going backward when sorting by a column having unique values', async () => {
  const queryOptions = {
    sort: gql`{ namePrimary: { descending: false } }`,
    last: 2,
  };

  let data = await sendQueryOk(createQuery(queryOptions));

  // Last page
  expectNames(['Yewbarrow', 'Yoke'], data);

  data = await sendQueryOk(
    createQuery({ ...queryOptions, before: data.hills.pageInfo.startCursor })
  );

  // Penultimate page before last
  expectNames(['Whiteless Pike', 'Whiteside'], data);

  data = await sendQueryOk(
    createQuery({ ...queryOptions, before: data.hills.pageInfo.startCursor })
  );

  // Second last page, we don't want to see anything we've seen before
  expectNames(['Whinlatter', 'White Side'], data);
});

test('going forward when sorting by a column containing duplicates', async () => {
  const queryOptions = {
    filter: gql`{ heightMetres: { eq: 678 }, lists: { id: { inc: MARILYN } } }`,
    sort: gql`{ height: { descending: true } }`,
    first: 2,
  };

  let data = await sendQueryOk(createQuery(queryOptions));

  // First page
  expectNames(['Hill of Wirren', 'Carn Mhic an Toisich'], data);

  data = await sendQueryOk(
    createQuery({ ...queryOptions, after: data.hills.pageInfo.endCursor })
  );

  // Second page follows first
  expectNames(['Carn Breac', 'Capel Fell'], data);

  data = await sendQueryOk(
    createQuery({ ...queryOptions, after: data.hills.pageInfo.endCursor })
  );

  // Third page, we don't want to see anything we've seen before
  expectNames(['Creigiau Gleision', 'Baugh Fell - Tarn Rigg Hill'], data);
});

test('going backward when sorting by a column containing duplicates', async () => {
  const queryOptions = {
    filter: gql`{ heightMetres: { eq: 678 }, lists: { id: { inc: MARILYN } } }`,
    sort: gql`{ height: { descending: true } }`,
    last: 2,
  };

  let data = await sendQueryOk(createQuery(queryOptions));

  // Last page
  expectNames(['Sawel', 'Slieve Snaght'], data);

  data = await sendQueryOk(
    createQuery({ ...queryOptions, before: data.hills.pageInfo.startCursor })
  );

  // Penultimate page, before the last
  expectNames(['Creigiau Gleision', 'Baugh Fell - Tarn Rigg Hill'], data);

  data = await sendQueryOk(
    createQuery({ ...queryOptions, before: data.hills.pageInfo.startCursor })
  );

  // 2nd-last page, we don't want to see anything we've seen before
  expectNames(['Carn Breac', 'Capel Fell'], data);
});

function expectNames(expected, data) {
  const actual = data.hills.nodes.map(hill => hill.names.primary);
  expect(actual).toEqual(expected);
}
