const fs = require('fs');
const util = require('util');
const csvParse = require('csv-parse/lib/sync');

const readFile = util.promisify(fs.readFile);

class CSVDataSource {
  constructor(filePath) {
    this.filePath = filePath;
  }

  start() {
    this.records = this.loadData();
  }

  initialize(config) {
    // Called by Apollo on each request
  }

  async loadData() {
    const textContent = await readFile(this.filePath, 'utf8');

    const options = {
      cast: value => (value === '' ? undefined : value),
      columns: true,
    };

    return csvParse(textContent, options);
  }
}

module.exports = CSVDataSource;
