const number = value => ({ N: value });
const string = value => ({ S: value });
const stringSet = value => ({ SS: value });

function removeEmptySets(item) {
  // DynamoDB: An attribute value cannot be an empty String or empty Set
  for (const [name, attribute] of Object.entries(item)) {
    const setValue = attribute.SS || attribute.NS || attribute.BS;

    if (setValue && setValue.length === 0) {
      delete item[name];
    }
  }
}

module.exports = {
  number,
  string,
  stringSet,
  removeEmptySets,
};
