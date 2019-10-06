function unwrapRecords(response) {
  if (!response.columnMetadata) {
    throw new Error('Missing column metadata; use includeResultMetadata');
  }

  return response.records.map(record => unwrapRecord(record, response.columnMetadata));
}

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
 * This can't be done automatically because column metadata only indicates it's a CHAR
 */
function unwrapSetFieldValue(value) {
  return value.split(',');
}

/**
 * Converts name-value map to
 * https://docs.aws.amazon.com/rdsdataservice/latest/APIReference/API_SqlParameter.html
 */
function buildParameters(paramMap) {
  return Object.entries(paramMap).map(([name, value]) => ({
    name,
    value: {
      [fieldValueKey(value)]: value,
    },
  }));
}

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

module.exports = {
  buildParameters,
  unwrapRecords,
  unwrapSetFieldValue,
};
