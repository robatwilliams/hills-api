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
    countries: { SS: COUNTRIES_CODES[row.Country] },
    heightFeet: { N: row.Feet },
    heightMetres: { N: row.Metres },
    lists: { SS: lists },
    mapsScale25k: { SS: parseMaps(row['Map 1:25k']) },
    mapsScale50k: { SS: parseMaps(row['Map 1:50k']) },
    name: { S: row.Name },
    number: { N: row.Number },
  };

  removeEmptySetAttributes(item);

  return {
    PutRequest: { Item: item },
  };
}

function parseMaps(maps) {
  return maps ? maps.split(' ') : [];
}

function removeEmptySetAttributes(item) {
  // DynamoDB: An attribute value cannot be an empty String or empty Set
  for (const [name, attribute] of Object.entries(item)) {
    const setValue = attribute.SS || attribute.NS || attribute.BS;

    if (setValue && setValue.length == 0) {
      delete item[name];
    }
  }
}

module.exports = createPutRequest;
