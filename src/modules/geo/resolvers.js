module.exports = {
  Country: {
    async name(country, args, { dataSources }) {
      const countryData = await dataSources.countries.byCode(country.code);
      return countryData.name;
    },
  },
};
