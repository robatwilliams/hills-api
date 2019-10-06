const { COUNTRIES_CODES, LIST_CODES } = require('./codes');
const parseMaps = require('./parseMaps');

function parseHill(row) {
  const lists = row.Classification.split(',')
    .map(code => LIST_CODES[code])
    .filter(Boolean); // mapping is incomplete

  return {
    countries: COUNTRIES_CODES[row.Country],
    heightFeet: Number(row.Feet),
    heightMetres: Number(row.Metres),
    lists,
    mapsScale25k: parseMaps(row['Map 1:25k']),
    mapsScale50k: parseMaps(row['Map 1:50k']),
    name: row.Name,
    number: Number(row.Number),
  };
}

module.exports = parseHill;
