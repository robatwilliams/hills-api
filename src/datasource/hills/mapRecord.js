function mapRecord(values, columnMetadata) {
  return columnMetadata.reduce((item, column, columnIndex) => {
    item[column.name] = unwrapValue(values[columnIndex], column);
    return item;
  }, {});
}

function unwrapValue(wrapper, column) {
  // resultSetOptions.decimalReturnType doesn't seem to work
  return column.typeName === 'DECIMAL'
    ? Number(wrapper.stringValue)
    : Object.values(wrapper)[0];
}

module.exports = mapRecord;
