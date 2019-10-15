module.exports = {
  resolvers: require('./resolvers'),
  schema: [
    require('./schema/Hill'),
    require('./schema/HillFilter'),
    require('./schema/List'),
    require('./schema/ListFilter'),
    require('./schema/ListId'),
    require('./schema/ListIdCriterion'),
    require('./schema/Query'),
  ],
};
