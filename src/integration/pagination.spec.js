const { encodeCursor } = require('../modules/hill/paginate');

const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

it('returns the first few when no paging specified', async () => {
  const query = createQuery();

  const data = await sendQueryOk(query);
  const hills = data.hills.nodes;

  expect(hills.length).toBe(10);
  expect(hills[0].name).toBe('Skiddaw');
});

it('assembles complete connection structure', async () => {
  const query = gql`
    {
      hills {
        edges {
          cursor
          node {
            name
          }
        }
        nodes {
          name
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  for (const edge of data.hills.edges) {
    expect(edge.node).toMatchObject({});
    expect(edge.cursor).toMatch(/[A-Za-z]+/u);
  }

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
    expect(hills[0].name).toBe('Skiddaw');
    expect(hills[4].name).toBe('Long Side');
  });

  it('returns those after cursor', async () => {
    const query = createQuery({ after: encodeCursor(2321) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[0].name).toBe('Carl Side');
  });

  it('has a next page when ending on the penultimate result', async () => {
    const query = createQuery({ after: encodeCursor(2627) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[hills.length - 1].name).toBe('Holme Fell');

    expect(data.hills.pageInfo).toMatchObject({
      hasNextPage: true,
      hasPreviousPage: null,
    });
  });

  it('has no next page when ending on the last result', async () => {
    const query = createQuery({ after: encodeCursor(2634) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[hills.length - 1].name).toBe('High Stile');

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
    expect(hills[0].name).toBe('Wetherlam');
    expect(hills[4].name).toBe('High Stile');
  });

  it('returns those before cursor', async () => {
    const query = createQuery({ before: encodeCursor(2673) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[hills.length - 1].name).toBe('Green Crag');
  });

  it('has a previous page when ending on the second result', async () => {
    const query = createQuery({ before: encodeCursor(2333) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[0].name).toBe('Blencathra - Hallsfell Top');

    expect(data.hills.pageInfo).toMatchObject({
      hasNextPage: null,
      hasPreviousPage: true,
    });
  });

  it('has no previous page when ending on the first result', async () => {
    const query = createQuery({ before: encodeCursor(2332) });

    const data = await sendQueryOk(query);
    const hills = data.hills.nodes;

    expect(hills[0].name).toBe('Skiddaw');

    expect(data.hills.pageInfo).toMatchObject({
      hasNextPage: null,
      hasPreviousPage: false,
    });
  });
});

function createQuery({ filter, first, after, last, before } = {}) {
  const defaultFilter = gql`{ lists: { id: { inc: WAINWRIGHT } } }`;

  const fieldsFragment = gql`
    {
      edges {
        cursor
      }
      nodes {
        name
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
        ${first == null ? '' : `first: ${first}`}
        ${after == null ? '' : `after: "${after}"`}
        ${last == null ? '' : `last: ${last}`}
        ${before == null ? '' : `before: "${before}"`}
      )
      ${fieldsFragment}
    }
  `;
}
