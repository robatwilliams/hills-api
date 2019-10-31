/* eslint-disable unicorn/no-unsafe-regex */

module.exports = function parseNames(string) {
  return string.split(' [').map(name => name.replace(']', ''));
};
