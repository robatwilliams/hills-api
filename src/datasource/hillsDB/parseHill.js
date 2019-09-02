const COUNTRIES_CODES = {
  E: ['England'],
  ES: ['England', 'Scotland'],
  I: ['Ireland'],
  S: ['Scotland'],
  W: ['Wales'],
};

const LIST_CODES = {
  Hew: 'HEWITT',
  M: 'MUNRO',
  W: 'WAINWRIGHT',
};

function parseHill(hill) {
  const lists = hill.Classification.split(',')
    .map(code => LIST_CODES[code])
    .filter(Boolean); // mapping is incomplete

  if (lists.length === 0) {
    // Constrain volume of data so it's easier to look at & navigate
    return undefined;
  }

  const countries = COUNTRIES_CODES[hill.Country].map(name => ({ name }));

  // Without the section number prefix
  const region = hill.Region.split(': ')[1];

  return {
    name: hill.Name,
    countries,
    county: hill.County,
    heightMetres: hill.Metres,
    island: hill.Island,
    lists,
    maps: {
      scale25k: parseMaps(hill['Map 1:25k']),
      scale50k: parseMaps(hill['Map 1:50k']),
    },
    number: Number(hill.Number),
    region,
  };
}

function parseMaps(maps) {
  if (!maps) {
    return [];
  }

  return maps.split(' ').map(sheet => ({ sheet }));
}

module.exports = parseHill;
