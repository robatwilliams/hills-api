const fs = require('fs');
const util = require('util');
const csvParse = require('csv-parse/lib/sync');

const readFile = util.promisify(fs.readFile);

const DATA_FILE_PATH = './data/DoBIH_v16_2.csv';

class HillsDBDataSource {

  start() {
    this.hills = this.loadData();
  }

  initialize(config) {
    // Called by Apollo
  }

  async loadData() {
    console.log('Loading hills data');
    const textContent = await readFile(DATA_FILE_PATH, 'utf8');
    return csvParse(textContent, { columns: true }).map(parseHill);
  }

  getAll() {
    return this.hills;
  }

}

function parseHill(hill) {
  return {
    name: hill.Name,
  };
}

module.exports = HillsDBDataSource;
