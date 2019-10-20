const { COUNTRIES_CODES, LIST_CODES } = require('./codes');
const parseMaps = require('./parseMaps');

module.exports = function parseHill(row) {
  const lists = row.Classification.split(',')
    .map(code => LIST_CODES[code])
    .filter(Boolean); // mapping is incomplete

  const number = Number(row.Number);
  const parentMarilynNumber = sanitizeMarilynParent({
    ownNumber: number,
    parentNumber: optionalNumber(row['Parent (Ma)']),
  });

  return {
    countries: COUNTRIES_CODES[row.Country],
    heightFeet: Number(row.Feet),
    heightMetres: Number(row.Metres),
    lists,
    mapsScale25k: parseMaps(row['Map 1:25k']),
    mapsScale50k: parseMaps(row['Map 1:50k']),
    name: row.Name,
    number,
    parentMarilynNumber,
  };
};

function optionalNumber(string) {
  return string == null ? null : Number(string);
}

function sanitizeMarilynParent({ ownNumber, parentNumber }) {
  // http://www.hills-database.co.uk/database_notes.html#parent
  if (parentNumber === 0) {
    return null; // No parent
  } else if (parentNumber === ownNumber) {
    return null; // Is itself a parent (there are no parents of parents)
  }

  return parentNumber;
}
