const fs = require('fs');
const util = require('util');
const csvParse = require('csv-parse/lib/sync');
const parseHill = require('./parseHill');

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

    const options = {
      cast: value => value === '' ? undefined : value,
      columns: true,
    };

    return csvParse(textContent, options)
      .map(parseHill)
      .filter(Boolean); // exclude those not parsed
  }

  async query({ list }) {
    const hills = await this.hills;
    return hills.filter(hill => list === undefined || hill.lists.includes(list));
  }

  async queryOne({ number }) {
    const hills = await this.hills;
    return hills.find(hill => hill.number === number);
  }

}

module.exports = HillsDBDataSource;
