const explorerRegex = /^OL\d{1,2}$/u;
const landrangerRegex = /^\d{1,3}$/u;

module.exports = function parseMaps(string) {
  if (string === 'IoM OL') {
    // Isle of Man Leisure map, not Ordnance Survey
    return [];
  }

  const maps = string ? string.split(' ') : [];

  return sanitizeMaps(maps);
};

function sanitizeMaps(maps) {
  const sanitized = maps.map(sanitizeMap);

  // Remove any duplicates introduced by sanitization, e.g. OL39N OL39S
  return [...new Set(sanitized)];
}

function sanitizeMap(map) {
  if (explorerRegex.test(map) || landrangerRegex.test(map)) {
    return map;
  } else if (/[NESW]$/u.test(map)) {
    // Discard any location-on-map information added to the sheet name, e.g. OL47W
    return sanitizeMap(map.slice(0, map.length - 1));
  }

  throw new Error(`Invalid map sheet: ${map}`);
}
