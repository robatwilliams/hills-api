module.exports = {
  Country: {
    name(country, args, { dataSources }) {
      return dataSources.countries.byCode(country.code).name;
    },
  },
};
