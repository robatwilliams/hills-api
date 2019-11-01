module.exports = {
  resolvers: require('./resolvers'),
  schema: [
    require('./schema/Hill'),
    require('./schema/HillEdge'),
    require('./schema/HillFilter'),
    require('./schema/HillsConnection'),
    require('./schema/List'),
    require('./schema/ListFilter'),
    require('./schema/ListId'),
    require('./schema/ListIdCriterion'),
    require('./schema/Names'),
    require('./schema/Query'),
  ],
};
