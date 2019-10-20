function flatten(array) {
  return Array.prototype.concat(...array);
}

function unique(array) {
  return [...new Set(array)];
}

module.exports = {
  flatten,
  unique,
};
