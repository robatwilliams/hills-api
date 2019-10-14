module.exports = {
  resolvers: require('./resolvers'),
  schema: [
    require('./schema/Hill'),
    require('./schema/List'),
    require('./schema/ListID'),
    require('./schema/Query'),
  ],
};
