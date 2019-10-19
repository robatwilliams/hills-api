const Hill = require('./model/Hill');
const { decodeCursor, encodeCursor } = require('./paginate');

const PAGINATION_LIMIT_DEFAULT = 10;

module.exports = {
  Query: {
    async hill(object, { number }, { dataSources }) {
      const entity = await dataSources.hills.queryOne({ number });

      return Hill.fromEntity(entity);
    },
    async hills(object, { filter, ...paginate }, { dataSources }) {
      setPaginateDefaults(paginate);
      const { first, last } = paginate;
      const limit = first == null ? last : first;

      const dataSourceFilter = {
        country: filter.countries && filter.countries.code.inc,
        heightFeet: filter.heightFeet,
        heightMetres: filter.heightMetres,
        list: filter.lists && filter.lists.id.inc,
      };
      const dataSourcePaginate = {
        limit: limit + 1, // +1 so we can determine if there are more items
        before: paginate.before && decodeCursor(paginate.before),
        after: paginate.after && decodeCursor(paginate.after),
      };

      const entities = await dataSources.hills.query(
        dataSourceFilter,
        dataSourcePaginate
      );

      const hasMore = entities.length === limit + 1;

      if (hasMore) {
        if (first != null) {
          entities.pop();
        } else if (last != null) {
          entities.shift();
        }
      }

      const hills = entities.map(Hill.fromEntity);
      const pageInfo = computePageInfo(hills, paginate, hasMore);

      return {
        nodes: hills,
        pageInfo,
      };
    },
  },
  Hill: {
    countries: ({ countries }) => countries,
    height(hill, { unit }) {
      switch (unit) {
        case 'FEET':
          return hill.height.feet;
        case 'METRES':
          return hill.height.metres;
        default:
          throw new Error(`Unknown unit: ${unit}`);
      }
    },
    lists({ lists }, args, { dataSources }) {
      return lists.map(id => dataSources.lists.byId(id));
    },
  },
  HillsConnection: {
    edges({ nodes }) {
      return nodes.map(node => ({
        node,
        cursor: encodeCursor(node),
      }));
    },
    nodes: ({ nodes }) => nodes,
    pageInfo: ({ pageInfo }) => pageInfo,
  },
  HillEdge: {
    node: ({ node }) => node,
  },
  List: {
    id: ({ id }) => id,
  },
};

function setPaginateDefaults(paginate) {
  if (paginate.first == null && paginate.last == null) {
    paginate.first = PAGINATION_LIMIT_DEFAULT;
  }
}

function computePageInfo(nodes, paginate, hasMore) {
  const lastNode = nodes[nodes.length - 1];

  return {
    endCursor: lastNode && encodeCursor(lastNode),
    startCursor: nodes[0] && encodeCursor(nodes[0]),

    /**
     * Only look in the direction of pagination; not implementing the optional part of
     * https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo .
     * Also returning null for the optional cases which is more accurate than false.
     */
    hasNextPage: paginate.first == null ? null : hasMore,
    hasPreviousPage: paginate.last == null ? null : hasMore,
  };
}
