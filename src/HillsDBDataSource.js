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

    const options = {
      cast: value => value === '' ? undefined : value,
      columns: true,
    }

    return csvParse(textContent, options)
      .map(parseHill)
      .filter(Boolean); // exclude those not parsed
  }

  async query({ list }) {
    const hills = await this.hills;
    return hills.filter(hill => list === undefined || hill.lists.includes(list));
  }

}

const COUNTRIES_CODES = {
  E: ['ENGLAND'],
  ES: ['ENGLAND', 'SCOTLAND'],
  I: ['IRELAND'],
  S: ['SCOTLAND'],
  W: ['WALES'],
};

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

  // Without the section number prefix
  const region = hill.Region.split(': ')[1];

  return {
    name: hill.Name,
    countries: COUNTRIES_CODES[hill.Country],
    county: hill.County,
    heightMetres: hill.Metres,
    island: hill.Island,
    lists,
    maps: {
      scale25k: parseMaps(hill['Map 1:25k']),
      scale50k: parseMaps(hill['Map 1:50k']),
    },
    region,
  };
}

function parseMaps(maps) {
  if (!maps) {
    return [];
  }

  return maps.split(' ')
    .map(sheet => ({ sheet }));
}

module.exports = HillsDBDataSource;
