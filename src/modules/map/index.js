module.exports = {
  resolvers: require('./resolvers'),
  schema: [
    require('./schema/GridReference'),
    require('./schema/Map'),
    require('./schema/Scale'),
  ],
};
