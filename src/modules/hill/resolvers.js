const { createBatchResolver } = require('graphql-resolve-batch');

const { unique } = require('../../util');
const { buildEdges, setPaginateDefaults } = require('../paginate');

const Hill = require('./model/Hill');
const ListId = require('./model/ListId');
const {
  buildDataSourceFilter,
  buildDataSourcePaginate,
  computePageInfo,
  getHillCursor,
} = require('./resolverHelpers');

module.exports = {
  Query: {
    async hill(object, { number }, { dataSources }) {
      const entity = await dataSources.hills.queryOne({ number });

      return Hill.fromEntity(entity);
    },
    async hills(object, { filter, ...paginate }, { dataSources }) {
      setPaginateDefaults(paginate);

      const dsFilter = buildDataSourceFilter(filter);
      const dsPaginate = buildDataSourcePaginate(paginate);

      const { entities, hasMore } = await dataSources.hills.query(dsFilter, dsPaginate);

      const hills = entities.map(Hill.fromEntity);
      const pageInfo = computePageInfo(hills, paginate, hasMore);

      return {
        nodes: hills,
        pageInfo,
      };
    },
    lists: () => Object.keys(ListId).map(id => ({ id })),
  },
  Hill: {
    countries: ({ countriesCodes }) => countriesCodes.map(code => ({ code })),
    height: (hill, { unit }) => hill.height(unit),
    lists: ({ lists }) => lists.map(id => ({ id })),
    parent: createBatchResolver(async (hills, args, { dataSources }) => {
      const parentNumbers = unique(
        hills.map(hill => hill.parentMarilynNumber).filter(number => number != null)
      );

      const { entities: parents } = await dataSources.hills.query(
        { numbers: parentNumbers },
        { limit: parentNumbers.length }
      );

      return hills.map(hill =>
        parents.find(parent => parent.number === hill.parentMarilynNumber)
      );
    }),
  },
  HillsConnection: {
    edges: ({ nodes }) => buildEdges(nodes, getHillCursor),
    nodes: ({ nodes }) => nodes,
    pageInfo: ({ pageInfo }) => pageInfo,
  },
  HillEdge: {
    node: ({ node }) => node,
  },
  List: {
    id: ({ id }) => id,
    name: ({ id }, args, { dataSources }) => dataSources.lists.getName(id),
  },
};
