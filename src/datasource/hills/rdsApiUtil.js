exports.unwrapRecords = function(response) {
  if (!response.columnMetadata) {
    throw new Error('Missing column metadata; use includeResultMetadata');
  }

  return response.records.map(record => unwrapRecord(record, response.columnMetadata));
};

/**
 * Array of arrays of fields -> an object
 */
function unwrapRecord(values, columnMetadata) {
  return columnMetadata.reduce((item, column, columnIndex) => {
    item[column.name] = unwrapField(values[columnIndex], column);
    return item;
  }, {});
}

/**
 * https://docs.aws.amazon.com/rdsdataservice/latest/APIReference/API_Field.html
 */
function unwrapField(wrapper, column) {
  // resultSetOptions.decimalReturnType doesn't seem to work
  return column.typeName === 'DECIMAL'
    ? Number(wrapper.stringValue)
    : Object.values(wrapper)[0];
}

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
