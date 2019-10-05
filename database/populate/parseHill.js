const { LIST_CODES } = require('./codes');

function parseHill(row) {
  const lists = row.Classification.split(',')
    .map(code => LIST_CODES[code])
    .filter(Boolean); // mapping is incomplete

  return {
    heightFeet: Number(row.Feet),
    heightMetres: Number(row.Metres),
    lists,
    name: row.Name,
    number: Number(row.Number),
  };
}

module.exports = parseHill;
