const { number, removeEmptySets, string, stringSet } = require('./dynamoAttribute');

// ISO 3166-1 & ISO 3166-2
const COUNTRIES_CODES = {
  E: ['GB-ENG'],
  ES: ['GB-ENG', 'GB-SCT'],
  I: ['IE'],
  S: ['GB-SCT'],
  W: ['GB-WAL'],
};

const LIST_CODES = {
  Hew: 'HEWITT',
  M: 'MUNRO',
  W: 'WAINWRIGHT',
};

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
