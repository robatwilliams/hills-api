const countries = require('./countries');

class CountriesDataSource {

  byName(name) {
    return countries.find(country => country.name === name);
  }

}

module.exports = CountriesDataSource;
