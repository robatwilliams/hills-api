const CSVDataSource = require('./CSVDataSource');

const DATA_FILE_PATH = './data/countries.csv';

class CountriesDataSource extends CSVDataSource {
  constructor() {
    super(DATA_FILE_PATH);
  }

  async byName(name) {
    return (await this.records).find(country => country.name === name);
  }
}

module.exports = CountriesDataSource;
