module.exports = {
  resolvers: require('./resolvers'),
  schema: [
    require('./schema/Coordinates'),
    require('./schema/Hill'),
    require('./schema/HillEdge'),
    require('./schema/HillFilter'),
    require('./schema/HillSort'),
    require('./schema/HillsConnection'),
    require('./schema/List'),
    require('./schema/ListFilter'),
    require('./schema/ListId'),
    require('./schema/ListIdCriterion'),
    require('./schema/Names'),
    require('./schema/Query'),
    require('./schema/Region'),
  ],
};
