module.exports = {
  Country: {
    async code(country, args, { dataSources }) {
      const countryData = await dataSources.countries.byName(country.name);
      return countryData.codeISO3166_2 || countryData.codeISO3166_1;
    },
  },
};
