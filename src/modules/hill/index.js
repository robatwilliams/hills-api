module.exports = {
  resolvers: require('./resolvers'),
  schema: [require('./schema/Hill'), require('./schema/List'), require('./schema/Query')],
};
