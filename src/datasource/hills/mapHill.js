function mapHill(item) {
  return {
    countries: mapCountries(mapSet(item.countries)),
    height: {
      feet: item.heightFeet,
      metres: item.heightMetres,
    },
    lists: mapSet(item.lists),
    maps: {
      scale25k: [],
      scale50k: [],
    },
    name: item.name,
    number: item.number,
  };
}

function mapCountries(countries) {
  return new Set([...countries].map(code => ({ code })));
}

function mapSet(value) {
  // This can't be in mapRecord because column metadata doesn't indicate that it's a set
  return value.split(',');
}

module.exports = mapHill;
