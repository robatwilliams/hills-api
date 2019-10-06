const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const mapHill = require('./mapHill');
const { buildParameters, unwrapRecords } = require('./rdsApiUtil');

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
      parameters: buildParameters(parameters),
      sql: `SELECT * FROM HILLS ${whereList}`,
    };

    const response = await this.executeStatement(params);

    return unwrapRecords(response).map(mapHill);
  }

  async queryOne({ number }) {
    const params = {
      parameters: buildParameters({ number }),
      sql: 'SELECT * FROM HILLS WHERE number = :number',
    };

    // TODO deal with slow-resume
    const response = await this.executeStatement(params);

    return mapHill(unwrapRecords(response)[0]);
  }

  async queryMaps({ numbers, scale }) {
    // Although documented, arrayValues isn't actually implemented.
    // Confirmed by https://github.com/jeremydaly/data-api-client#you-cant-send-in-an-array-of-values
    const inList = numbers.join(',');

    const params = {
      parameters: buildParameters({ scale }),
      sql: `SELECT hillNumber, sheet FROM HILLS_MAPS WHERE scale = :scale AND hillNumber IN (${inList})`,
    };

    const response = await this.executeStatement(params);

    return unwrapRecords(response);
  }

  executeStatement(statementParams) {
    const params = {
      database: 'HILLS',
      includeResultMetadata: true, // include column names
      resourceArn: process.env.DATABASE_CLUSTER_ARN,
      secretArn: process.env.DATABASE_CLUSTER_SECRET_ARN,
      ...statementParams,
    };

    return this.client.executeStatement(params).promise();
  }
}

module.exports = HillsDataSource;
