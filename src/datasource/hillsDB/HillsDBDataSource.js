const CSVDataSource = require('../CSVDataSource');
const parseHill = require('./parseHill');

const DATA_FILE_PATH = './data/DoBIH_v16_2.csv';

class HillsDBDataSource extends CSVDataSource {
  constructor() {
    super(DATA_FILE_PATH);
  }

  async loadData() {
    console.log('Loading hills data');
    const hills = await super.loadData();
    return hills.map(parseHill).filter(Boolean); // exclude those not parsed
  }

  async query({ list }) {
    const hills = await this.records;
    return hills.filter(hill => list === undefined || hill.lists.includes(list));
  }

  async queryOne({ number }) {
    const hills = await this.records;
    return hills.find(hill => hill.number === number);
  }
}

module.exports = HillsDBDataSource;
