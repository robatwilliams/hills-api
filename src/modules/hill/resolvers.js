const Hill = require('./model/Hill');

module.exports = {
  Query: {
    async hill(object, { number }, { dataSources }) {
      const entity = await dataSources.hills.queryOne({ number });

      return Hill.fromEntity(entity);
    },
    async hills(object, { filter, first }, { dataSources }) {
      const dataSourceFilter = {
        country: filter.countries && filter.countries.code.inc,
        heightFeet: filter.heightFeet,
        heightMetres: filter.heightMetres,
        list: filter.lists && filter.lists.id.inc,
      };
      const pagination = { first };

      const entities = await dataSources.hills.query(dataSourceFilter, pagination);
      const nodes = entities.map(Hill.fromEntity);

      return {
        edges: nodes.map(node => ({ node })),
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
