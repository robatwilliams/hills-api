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
    return csvParse(textContent, { columns: true })
      .map(parseHill)
      .filter(Boolean); // exclude those not parsed
  }

  async query({ list }) {
    const hills = await this.hills;
    return hills.filter(hill => list === undefined || hill.lists.includes(list));
  }

}

const LIST_CODES = {
  Hew: 'HEWITT',
  M: 'MUNRO',
  W: 'WAINWRIGHT',
};

function parseHill(hill) {
  const lists = hill.Classification.split(',')
    .map(code => LIST_CODES[code])
    .filter(Boolean); // mapping is incomplete

  if (lists.length === 0) {
    // Constrain volume of data so it's easier to look at & navigate
    return undefined;
  }

  return {
    name: hill.Name,
    lists,
  };
}

module.exports = HillsDBDataSource;
