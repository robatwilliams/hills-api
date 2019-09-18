const CSVDataSource = require('./CSVDataSource');

const DATA_FILE_PATH = './data/countries.csv';

class CountriesDataSource extends CSVDataSource {
  constructor() {
    super(DATA_FILE_PATH);
  }

  async byCode(code) {
    return (await this.records).find(
      country => country.codeISO3166_2 === code || country.codeISO3166_1 === code
    );
  }
}

module.exports = CountriesDataSource;
