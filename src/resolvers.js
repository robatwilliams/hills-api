module.exports = {
  Query: {
    hills(obj, { list }, { dataSources }) {
      return dataSources.hillsDB.query({ list });
    }
  },
  Country: {
    code(country, args, { dataSources }) {
      const countryData = dataSources.countries.byName(country.name);
      return countryData && (countryData.codeISO3166_2 || countryData.codeISO3166_1);
    }
  },
};
