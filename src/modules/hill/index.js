module.exports = {
  resolvers: require('./resolvers'),
  schema: [
    require('./schema/Filter'),
    require('./schema/Hill'),
    require('./schema/List'),
    require('./schema/ListId'),
    require('./schema/Query'),
  ],
};
