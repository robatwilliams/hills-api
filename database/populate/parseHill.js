const { COUNTRIES_CODES, LIST_CODES } = require('./codes');

const explorerRegex = /^OL\d{1,2}$/;
const landrangerRegex = /^\d{1,3}$/;

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

function parseMaps(string) {
  if (string === 'IoM OL') {
    // Isle of Man Leisure map, not Ordnance Survey
    return string;
  }

  const maps = string ? string.split(' ') : [];

  return sanitizeMaps(maps);
}

function sanitizeMaps(maps) {
  const sanitized = maps.map(sanitizeMap);

  // Remove any duplicates removed by sanitization, e.g. OL39N OL39S
  return [...new Set(sanitized)];
}

function sanitizeMap(map) {
  if (explorerRegex.test(map) || landrangerRegex.test(map)) {
    return map;
  } else if (/(N|E|S|W)$/.test(map)) {
    // Discard any location-on-map information added to the sheet name, e.g. OL47W
    return sanitizeMap(map.substr(0, map.length - 1));
  }

  throw new Error('Invalid map sheet: ' + map);
}

module.exports = parseHill;
