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

  return {
    name: hill.Name,
    countries,
    heightMetres: hill.Metres,
    lists,
    maps: {
      scale25k: parseMaps(hill['Map 1:25k']),
      scale50k: parseMaps(hill['Map 1:50k']),
    },
    number: Number(hill.Number),
  };
}

function parseMaps(maps) {
  if (!maps) {
    return [];
  }

  return maps.split(' ').map(sheet => ({ sheet }));
}

module.exports = parseHill;
