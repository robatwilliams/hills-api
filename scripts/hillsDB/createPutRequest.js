const { COUNTRIES_CODES, LIST_CODES } = require('./codes');
const { number, removeEmptySets, string, stringSet } = require('./dynamoAttribute');

function createPutRequest(row) {
  const lists = row.Classification.split(',')
    .map(code => LIST_CODES[code])
    .filter(Boolean); // mapping is incomplete

  const item = {
    countries: stringSet(COUNTRIES_CODES[row.Country]),
    heightFeet: number(row.Feet),
    heightMetres: number(row.Metres),
    lists: stringSet(lists),
    mapsScale25k: stringSet(parseMaps(row['Map 1:25k'])),
    mapsScale50k: stringSet(parseMaps(row['Map 1:50k'])),
    name: string(row.Name),
    number: number(row.Number),
  };

  removeEmptySets(item);

  return {
    PutRequest: { Item: item },
  };
}

function parseMaps(maps) {
  return maps ? maps.split(' ') : [];
}

module.exports = createPutRequest;
