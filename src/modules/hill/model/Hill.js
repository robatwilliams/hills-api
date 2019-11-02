const { UnitOfLength } = require('../../measure');

module.exports = class Hill {
  static fromEntity(entity) {
    if (!entity) {
      return undefined;
    }

    const { countries, ...noConflict } = entity;

    return new Hill({
      ...noConflict,
      countriesCodes: countries,
    });
  }

  constructor(fields) {
    Object.assign(this, fields);
  }

  coordinates() {
    return {
      geodetic: {
        latitude: this.geodeticLatitude,
        longitude: this.geodeticLongitude,
      },
      grid: {
        easting: this.gridRef6Easting,
        northing: this.gridRef6Northing,
        square: this.gridRefSquare,
      },
    };
  }

  height(unit) {
    switch (unit) {
      case UnitOfLength.FEET:
        return this.heightFeet;
      case UnitOfLength.METRES:
        return this.heightMetres;
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  }
};
