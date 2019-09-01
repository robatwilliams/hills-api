const fs = require('fs');
const util = require('util');
const csvParse = require('csv-parse/lib/sync');

const readFile = util.promisify(fs.readFile);

const DATA_FILE_PATH = './data/DoBIH_v16_2.csv';

class HillsDBDataSource {

  initialize(config) {
    this.hills = this.loadData();
  }

  async loadData() {
    const textContent = await readFile(DATA_FILE_PATH, 'utf8');
    return csvParse(textContent, { columns: true });
  }

  getAllHills() {
    return this.hills;
  }

}

module.exports = HillsDBDataSource;
