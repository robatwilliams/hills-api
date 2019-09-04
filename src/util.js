function flatten(array) {
  return Array.prototype.concat(...array);
}

module.exports = {
  flatten,
};
