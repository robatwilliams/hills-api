module.exports = {
  resolvers: require('./resolvers'),
  schema: [
    require('./schema/Country'),
    require('./schema/CountryFilter'),
    require('./schema/GeodeticCoordinates'),
    require('./schema/Query'),
  ],
};
