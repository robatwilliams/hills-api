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
};
