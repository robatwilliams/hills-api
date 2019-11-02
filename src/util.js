function flatten(array) {
  return Array.prototype.concat(...array);
}

function mapValues(object, mapper) {
  const mapped = {};

  for (const [key, value] of Object.entries(object)) {
    mapped[key] = mapper(value);
  }

  return mapped;
}

function unique(array) {
  return [...new Set(array)];
}

module.exports = {
  flatten,
  mapValues,
  unique,
};
