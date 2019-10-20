const countries = [
  /* eslint-disable camelcase */
  { name: 'England', codeISO3166_2: 'GB-ENG' },
  { name: 'Ireland', codeISO3166_1: 'IE' },
  { name: 'Isle of Man', codeISO3166_2: 'IM' },
  { name: 'Scotland', codeISO3166_2: 'GB-SCT' },
  { name: 'Wales', codeISO3166_2: 'GB-WAL' },
  /* eslint-enable camelcase */
];

module.exports = class CountriesDataSource {
  all() {
    return countries;
  }

  byCode(code) {
    return countries.find(
      country => country.codeISO3166_2 === code || country.codeISO3166_1 === code
    );
  }
};
