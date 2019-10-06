class Hill {
  static fromEntity(entity) {
    if (!entity) {
      return;
    }

    const countries = entity.countries.map(code => ({ code }));

    return {
      countries,
      height: {
        feet: entity.heightFeet,
        metres: entity.heightMetres,
      },
      lists: entity.lists,
      name: entity.name,
      number: entity.number,
    };
  }
}

module.exports = Hill;
