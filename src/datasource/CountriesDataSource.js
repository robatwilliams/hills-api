const countries = [
  /* eslint-disable camelcase */
  { name: 'England', codeISO3166_2: 'GB-ENG' },
  { name: 'Ireland', codeISO3166_1: 'IE' },
  { name: 'Scotland', codeISO3166_2: 'GB-SCT' },
  { name: 'Wales', codeISO3166_2: 'GB-WAL' },
  /* eslint-enable camelcase */
];

class CountriesDataSource {
  byCode(code) {
    return countries.find(
      country => country.codeISO3166_2 === code || country.codeISO3166_1 === code
    );
  }
}

module.exports = CountriesDataSource;
