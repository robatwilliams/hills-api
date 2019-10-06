const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const mapHill = require('./mapHill');
const { buildParameters, unwrapRecords } = require('./rdsApiUtil');

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
    const parameters = {};
    let whereList = '';

    if (list !== undefined) {
      whereList = 'WHERE FIND_IN_SET(:list, lists)';
      parameters.list = list;
    }

    const params = {
      ...staticParams,
      parameters: buildParameters(parameters),
      sql: `SELECT * FROM HILLS ${whereList}`,
    };

    const response = await this.client.executeStatement(params).promise();

    return unwrapRecords(response).map(mapHill);
  }

  async queryOne({ number }) {
    const params = {
      ...staticParams,
      parameters: buildParameters({ number }),
      sql: 'SELECT * FROM HILLS WHERE number = :number',
    };

    // TODO deal with slow-resume
    const response = await this.client.executeStatement(params).promise();

    return mapHill(unwrapRecords(response)[0]);
  }

  async queryMaps({ numbers, scale }) {
    // Although documented, arrayValues isn't actually implemented.
    // Confirmed by https://github.com/jeremydaly/data-api-client#you-cant-send-in-an-array-of-values
    const inList = numbers.join(',');

    const params = {
      ...staticParams,
      parameters: buildParameters({ scale }),
      sql: `SELECT hillNumber, sheet FROM HILLS_MAPS WHERE scale = :scale AND hillNumber IN (${inList})`,
    };

    const response = await this.client.executeStatement(params).promise();

    return unwrapRecords(response);
  }
}

module.exports = HillsDataSource;
