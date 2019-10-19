const Hill = require('./model/Hill');
const HillEdge = require('./model/HillEdge');
const { decodeCursor } = require('./paginate');

const PAGINATION_LIMIT_DEFAULT = 10;

module.exports = {
  Query: {
    async hill(object, { number }, { dataSources }) {
      const entity = await dataSources.hills.queryOne({ number });

      return Hill.fromEntity(entity);
    },
    async hills(object, { filter, ...paginate }, { dataSources }) {
      const dataSourceFilter = {
        country: filter.countries && filter.countries.code.inc,
        heightFeet: filter.heightFeet,
        heightMetres: filter.heightMetres,
        list: filter.lists && filter.lists.id.inc,
      };
      const dataSourcePaginate = {
        limit: getPaginationLimit(paginate),
        before: paginate.before && decodeCursor(paginate.before),
        after: paginate.after && decodeCursor(paginate.after),
      };

      const entities = await dataSources.hills.query(
        dataSourceFilter,
        dataSourcePaginate
      );
      const hills = entities.map(Hill.fromEntity);

      return {
        edges: hills.map(HillEdge.forHill),
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
    edges: ({ edges }) => edges,
  },
  HillEdge: {
    node: ({ node }) => node,
  },
  List: {
    id: ({ id }) => id,
  },
};

function getPaginationLimit({ first, last }) {
  if (first != null) {
    return first;
  } else if (last != null) {
    return last;
  }

  return PAGINATION_LIMIT_DEFAULT;
}
