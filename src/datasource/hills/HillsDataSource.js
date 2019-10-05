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
    this.client = new RDSDataService({ region: process.env.DATABASE_REGION });
  }

  async queryOne({ number }) {
    const params = {
      ...staticParams,
      parameters: [{ name: 'number', value: { longValue: number } }],
      sql: 'SELECT * FROM HILLS WHERE number = :number',
    };

    const response = await this.client.executeStatement(params).promise();
    const record = response.records[0];

    return mapHill(mapRecord(record, response.columnMetadata));
  }
}

module.exports = HillsDataSource;
