const { createBatchResolver } = require('graphql-resolve-batch');

const { unique } = require('../../util');
const { buildEdges, setPaginateDefaults } = require('../paginate');

const Hill = require('./model/Hill');
const ListId = require('./model/ListId');
const {
  buildDataSourceFilter,
  buildDataSourcePaginate,
  computePageInfo,
  findHillNames,
  getHillCursor,
} = require('./resolverHelpers');

module.exports = {
  Query: {
    async hill(object, { number }, { dataSources }) {
      const entity = await dataSources.hills.queryOne({ number });

      return Hill.fromEntity(entity);
    },
    async hills(object, args, context) {
      const { filter, sort, ...paginate } = args;
      const { dataSources } = context;

      // For use in child resolvers
      context.rootArgs = args;

      setPaginateDefaults(paginate);

      const dsFilter = buildDataSourceFilter(filter);
      const dsPaginate = buildDataSourcePaginate(paginate);

      const { entities, hasMore } = await dataSources.hills.query(
        dsFilter,
        sort,
        dsPaginate
      );

      const hills = entities.map(Hill.fromEntity);
      const pageInfo = computePageInfo({ hasMore, nodes: hills, paginate, sort });

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
    names: createBatchResolver(async (hills, args, { dataSources }) => {
      const numbers = unique(hills.map(({ number }) => number));

      const entities = await dataSources.hills.queryNames({ numbers });

      return hills.map(hill => findHillNames(entities, hill));
    }),
    parent: createBatchResolver(async (hills, args, { dataSources }) => {
      const parentNumbers = unique(
        hills.map(hill => hill.parentMarilynNumber).filter(number => number != null)
      );

      const { entities: parents } = await dataSources.hills.query(
        { numbers: parentNumbers },
        {},
        { limit: parentNumbers.length }
      );

      return hills.map(hill =>
        parents.find(parent => parent.number === hill.parentMarilynNumber)
      );
    }),
  },
  HillsConnection: {
    edges({ nodes }, args, { rootArgs }) {
      return buildEdges(nodes, hill => getHillCursor(hill, rootArgs.sort));
    },
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
