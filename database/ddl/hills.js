const { DOUBLE, LONG, STRING } = require('./types');

module.exports = {
  countries: [STRING],
  geodeticLatitude: DOUBLE,
  geodeticLongitude: DOUBLE,
  gridRef6Easting: LONG,
  gridRef6Northing: LONG,
  gridRefSquare: STRING,
  heightFeet: DOUBLE,
  heightMetres: DOUBLE,
  lists: [STRING],
  number: LONG,
  parentMarilynNumber: LONG,
};
