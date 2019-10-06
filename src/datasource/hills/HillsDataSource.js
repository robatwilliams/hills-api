const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const mapHill = require('./mapHill');
const mapRecord = require('./mapRecord');

const staticParams = {
  database: 'HILLS',
  includeResultMetadata: true, // include column names
  resourceArn: process.env.DATABASE_CLUSTER_ARN,
  secretArn: process.env.DATABASE_CLUSTER_SECRET_ARN,
};

class HillsDataSource {
  constructor() {
    this.client = new RDSDataService(); // region from env:AWS_REGION
  }

  async query({ list }) {
    let sql = 'SELECT * FROM HILLS';
    const parameters = [];

    if (list !== undefined) {
      sql += ' WHERE FIND_IN_SET(:list, lists)';
      parameters.push({ name: 'list', value: { stringValue: list } });
    }

    const params = { ...staticParams, parameters, sql };
    const response = await this.client.executeStatement(params).promise();

    return response.records
      .map(record => mapRecord(record, response.columnMetadata))
      .map(mapHill);
  }

  async queryOne({ number }) {
    const params = {
      ...staticParams,
      parameters: [{ name: 'number', value: { longValue: number } }],
      sql: 'SELECT * FROM HILLS WHERE number = :number',
    };

    // TODO deal with slow-resume
    const response = await this.client.executeStatement(params).promise();
    const record = response.records[0];

    return mapHill(mapRecord(record, response.columnMetadata));
  }

  async queryMaps({ numbers, scale }) {
    // Although documented, arrayValues isn't actually implemented.
    // Confirmed by https://github.com/jeremydaly/data-api-client#you-cant-send-in-an-array-of-values
    const inList = numbers.join(',');

    const params = {
      ...staticParams,
      parameters: [{ name: 'scale', value: { longValue: scale } }],
      sql: `SELECT hillNumber, sheet FROM HILLS_MAPS WHERE scale = :scale AND hillNumber IN (${inList})`,
    };

    const response = await this.client.executeStatement(params).promise();

    return response.records.map(record => mapRecord(record, response.columnMetadata));
  }
}

module.exports = HillsDataSource;
