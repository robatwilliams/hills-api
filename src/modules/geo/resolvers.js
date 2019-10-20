module.exports = {
  Query: {
    countries(object, args, { dataSources }) {
      return dataSources.countries.all().map(country => ({
        code: country.codeISO3166_2 || country.codeISO3166_1,
        name: country.name,
      }));
    },
  },
  Country: {
    name(country, args, { dataSources }) {
      return dataSources.countries.byCode(country.code).name;
    },
  },
};
