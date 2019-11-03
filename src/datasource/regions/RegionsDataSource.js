/**
 * Relative Hill of Britain book sections:
 *   1. Copy from Hills database
 *   2. Remove duplicate _codes_ in Excel
 *   3. Add "A" or "B" to names of 4 pairs of sections that have the same name
 *   4. Remove the code from the name with ^[A-Z0-9:]+
 *   5. Transpose to JSON object using https://www.csvjson.com/csv2json
 */
const regions = require('./rhbSections');

module.exports = class RegionsDataSource {
  all() {
    return Object.values(regions);
  }

  byCode(code) {
    return regions[code];
  }

  getCode(name) {
    return Object.keys(regions).find(code => regions[code] === name);
  }
};
