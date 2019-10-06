module.exports = function mapHill(item) {
  return {
    countries: mapCountries(readSetAttribute(item.countries)),
    height: {
      feet: item.heightFeet,
      metres: item.heightMetres,
    },
    lists: readSetAttribute(item.lists),
    maps: {
      scale25k: mapMaps(readSetAttribute(item.mapsScale25k)),
      scale50k: mapMaps(readSetAttribute(item.mapsScale50k)),
    },
    name: item.name,
    number: item.number,
  };
};

function mapCountries(countries) {
  return new Set([...countries].map(code => ({ code })));
}

function mapMaps(maps) {
  return new Set([...maps].map(sheet => ({ sheet })));
}

function readSetAttribute(attribute) {
  // DynamoDB: An attribute value cannot be an empty String or empty Set
  return new Set(attribute && attribute.values);
}
