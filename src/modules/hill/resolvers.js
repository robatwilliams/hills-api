module.exports = {
  Query: {
    hill(object, { number }, { dataSources }) {
      return dataSources.hills.queryOne({ number });
    },
    hills(object, { list }, { dataSources }) {
      return dataSources.hills.query({ list });
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
          throw new Error('Unknown unit ' + unit);
      }
    },
  },
};
