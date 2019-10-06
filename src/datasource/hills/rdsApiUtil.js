/**
 * Converts name-value map to
 * https://docs.aws.amazon.com/rdsdataservice/latest/APIReference/API_SqlParameter.html
 */
exports.buildParameters = function(paramMap) {
  return Object.entries(paramMap).map(([name, value]) => ({
    name,
    value: {
      [fieldValueKey(value)]: value,
    },
  }));
};

/**
 * https://docs.aws.amazon.com/rdsdataservice/latest/APIReference/API_Field.html
 */
function fieldValueKey(value) {
  if (typeof value === 'string') {
    return 'stringValue';
  } else if (Number.isInteger(value)) {
    return 'longValue';
  }

  throw new Error('Not implemented for values of this type: ' + value);
}
