const { encodeJSONCursor } = require('../modules/paginate');

const gql = require('./graphql-tag-raw');
const { sendQuery, sendQueryOk } = require('./helpers');

it('returns the first few when no paging specified', async () => {
  const query = createQuery();

  const data = await sendQueryOk(query);
  const hills = data.hills.nodes;

  expect(hills.length).toBe(10);
  expect(hills[0].names.primary).toBe('Skiddaw');
});

it('assembles complete connection structure', async () => {
  const query = gql`
    {
      hills {
        edges {
          cursor
          node {
            names {
              primary
            }
          }
        }
        nodes {
          names {
            primary
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hills.edges.length).toBeGreaterThan(0);
  expect(data.hills.edges).toSatisfyAll(
    edge => edge.node != null && /[A-Za-z]+/u.test(edge.cursor)
  );
  expect(data.hills.nodes).toHaveLength(data.hills.edges.length);
});

describe('pageInfo: cursors', () => {
  it('refer to the first and last nodes/edges', async () => {
    const query = createQuery();

    const data = await sendQueryOk(query);
    const { edges, pageInfo } = data.hills;

    expect(pageInfo).toMatchObject({
      endCursor: edges[edges.length - 1].cursor,
      startCursor: edges[0].cursor,
    });
  });

  it('are null when there are no results', async () => {
    const filter = gql`{ heightMetres: { gt: 5000 } }`;
    const query = createQuery({ filter });

    const data = await sendQueryOk(query);
    const { pageInfo } = data.hills;

    expect(pageInfo).toMatchObject({
      endCursor: null,
      startCursor: null,
    });
  });
});

it('returns fewer than the limit when there are fewer results', async () => {
  const filter = gql`{ heightMetres: { gt: 1300 } }`;
  const query = createQuery({ filter, first: 5 });

  const data = await sendQueryOk(query);
  const hills = data.hills.nodes;

  expect(hills).toHaveLength(2);
  expect(data.hills.pageInfo).toMatchObject({
    hasNextPage: false,
    hasPreviousPage: null,
  });
});

describe('going forward', () => {
  it('returns first n', async () => {
    const query = createQuery({ first: 5 });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills).toHaveLength(5);
    expect(hills[0].names.primary).toBe('Skiddaw');
    expect(hills[4].names.primary).toBe('Long Side');
  });

  it('returns those after cursor', async () => {
    const query = createQuery({ after: encodeCursor(2321) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[0].names.primary).toBe('Carl Side');
  });

  it('has a next page when ending on the penultimate result', async () => {
    const query = createQuery({ after: encodeCursor(2627) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[hills.length - 1].names.primary).toBe('Holme Fell');

    expect(data.hills.pageInfo).toMatchObject({
      hasNextPage: true,
      hasPreviousPage: null,
    });
  });

  it('has no next page when ending on the last result', async () => {
    const query = createQuery({ after: encodeCursor(2634) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[hills.length - 1].names.primary).toBe('High Stile');

    expect(data.hills.pageInfo).toMatchObject({
      hasNextPage: false,
      hasPreviousPage: null,
    });
  });
});

describe('going backward', () => {
  it('returns last n', async () => {
    const query = createQuery({ last: 5 });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills).toHaveLength(5);
    expect(hills[0].names.primary).toBe('Wetherlam');
    expect(hills[4].names.primary).toBe('High Stile');
  });

  it('returns those before cursor', async () => {
    const query = createQuery({ before: encodeCursor(2673) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[hills.length - 1].names.primary).toBe('Green Crag');
  });

  it('has a previous page when ending on the second result', async () => {
    const query = createQuery({ before: encodeCursor(2333) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[0].names.primary).toBe('Blencathra - Hallsfell Top');

    expect(data.hills.pageInfo).toMatchObject({
      hasNextPage: null,
      hasPreviousPage: true,
    });
  });

  it('has no previous page when ending on the first result', async () => {
    const query = createQuery({ before: encodeCursor(2332) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[0].names.primary).toBe('Skiddaw');

    expect(data.hills.pageInfo).toMatchObject({
      hasNextPage: null,
      hasPreviousPage: false,
    });
  });
});

describe('handling invalid arguments', () => {
  it('rejects incompatible arguments', async () => {
    // Just test one case, the conditions are similar enough
    const query = createQuery({ first: 1, last: 1 });

    const response = await sendQuery(query);

    expect(response.status).toBe(400);
    expect(response).toContainOneError(
      'Limits given for both forward and backward pagination'
    );
  });

  it('rejects negative limit', async () => {
    const query = createQuery({ first: -1 });

    const response = await sendQuery(query);

    expect(response.status).toBe(400);
    expect(response).toContainOneError('Negative pagination limit given');
  });

  it('rejects limit above maximum', async () => {
    const query = createQuery({ first: 777 });

    const response = await sendQuery(query);

    expect(response.status).toBe(400);
    expect(response).toContainOneError(
      'Paginaton limit given is above the maximum of 100'
    );
  });

  it('does not cause internal server error when given an invalid cursor', async () => {
    const query = createQuery({ after: 'hello!' }); // not a valid base64 string

    await sendQueryOk(query);
  });
});

function createQuery({ filter, sort, first, after, last, before } = {}) {
  const defaultFilter = gql`{ lists: { id: { inc: WAINWRIGHT } } }`;

  const fieldsFragment = gql`
    {
      edges {
        cursor
      }
      nodes {
        names {
          primary
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
    }
  `;

  return gql`
    {
      hills(
        filter: ${filter || defaultFilter}
        ${sort == null ? '' : `sort: ${sort}`}
        ${first == null ? '' : `first: ${first}`}
        ${after == null ? '' : `after: "${after}"`}
        ${last == null ? '' : `last: ${last}`}
        ${before == null ? '' : `before: "${before}"`}
      )
      ${fieldsFragment}
    }
  `;
}

function encodeCursor(hillNumber) {
  // Tests would be hard to read if cursors were encoded
  return encodeJSONCursor({ number: hillNumber });
}

module.exports = { createQuery };
