const Hill = require('./model/Hill');

module.exports = {
  Query: {
    async hill(object, { number }, { dataSources }) {
      const entity = await dataSources.hills.queryOne({ number });

      return Hill.fromEntity(entity);
    },
    async hills(object, { filter }, { dataSources }) {
      const dataSourceFilter = {
        country: filter.countries && filter.countries.code.inc,
        heightMetres: filter.heightMetres,
        list: filter.lists && filter.lists.id.inc,
      };

      const entities = await dataSources.hills.query(dataSourceFilter);

      return entities.map(Hill.fromEntity);
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
  List: {
    id: ({ id }) => id,
  },
};
