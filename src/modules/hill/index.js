module.exports = {
  resolvers: require('./resolvers'),
  schema: [
    require('./schema/Hill'),
    require('./schema/HillsFilter'),
    require('./schema/List'),
    require('./schema/ListId'),
    require('./schema/Query'),
  ],
};
