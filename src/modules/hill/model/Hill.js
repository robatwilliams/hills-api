const { UnitOfLength } = require('../../measure');

module.exports = class Hill {
  static fromEntity(entity) {
    if (!entity) {
      return undefined;
    }

    const countries = entity.countries.map(code => ({ code }));

    return new Hill({
      countries,
      height: {
        feet: entity.heightFeet,
        metres: entity.heightMetres,
      },
      lists: entity.lists,
      name: entity.name,
      number: entity.number,
    });
  }

  constructor(fields) {
    const { height, ...withoutArguments } = fields;

    this.fieldsWithArguments = { height };
    Object.assign(this, withoutArguments);
  }

  height(unit) {
    const { height } = this.fieldsWithArguments;

    switch (unit) {
      case UnitOfLength.FEET:
        return height.feet;
      case UnitOfLength.METRES:
        return height.metres;
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  }
};
