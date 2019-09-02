module.exports = {
  Query: {
    hills(obj, { list }, { dataSources }) {
      return dataSources.hillsDB.query({ list });
    }
  },
};
