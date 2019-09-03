module.exports = {
  Query: {
    hill(obj, { number }, { dataSources }) {
      return dataSources.hills.queryOne({ number });
    },
    hills(obj, { list }, { dataSources }) {
      return dataSources.hills.query({ list });
    },
  },
  Country: {
    code(country, args, { dataSources }) {
      const countryData = dataSources.countries.byName(country.name);
      return countryData && (countryData.codeISO3166_2 || countryData.codeISO3166_1);
    },
  },
  Hill: {
    height(hill, { unit }, context) {
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
