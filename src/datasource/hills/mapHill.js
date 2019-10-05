function mapHill(item) {
  return {
    countries: [],
    height: {
      feet: item.heightFeet,
      metres: item.heightMetres,
    },
    lists: [],
    maps: {
      scale25k: [],
      scale50k: [],
    },
    name: item.name,
    number: item.number,
  };
}

module.exports = mapHill;
