exports.number = value => ({ N: value });
exports.string = value => ({ S: value });
exports.stringSet = value => ({ SS: value });

exports.removeEmptySets = function(item) {
  // DynamoDB: An attribute value cannot be an empty String or empty Set
  for (const [name, attribute] of Object.entries(item)) {
    const setValue = attribute.SS || attribute.NS || attribute.BS;

    if (setValue && setValue.length === 0) {
      delete item[name];
    }
  }
};
