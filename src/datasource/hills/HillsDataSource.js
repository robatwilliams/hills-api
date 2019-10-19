const RDSDataService = require('aws-sdk/clients/rdsdataservice');

const { filterWhere } = require('./filtering');
const { buildParameters, unwrapRecords, unwrapSetFieldValue } = require('./rdsApiUtil');

module.exports = class HillsDataSource {
  constructor() {
    this.client = new RDSDataService(); // region from env:AWS_REGION
  }

  async query(filters, pagination) {
    const { parameters, whereClause } = filterWhere(filters);

    parameters.limit = pagination.first;

    const response = await this.executeStatement({
      parameters: buildParameters(parameters),
      sql: `SELECT * FROM HILLS ${whereClause || ''} LIMIT :limit`,
    });

    return unwrapHillRecords(response);
  }

  async queryOne({ number }) {
    const response = await this.executeStatement({
      parameters: buildParameters({ number }),
      sql: 'SELECT * FROM HILLS WHERE number = :number',
    });

    return unwrapHillRecords(response)[0];
  }

  async queryMaps({ numbers, scale }) {
    // Although documented, arrayValues isn't actually implemented.
    // Confirmed by https://github.com/jeremydaly/data-api-client#you-cant-send-in-an-array-of-values
    const inList = numbers.join(',');

    const response = await this.executeStatement({
      parameters: buildParameters({ scale }),
      sql: `SELECT hillNumber, sheet FROM HILLS_MAPS WHERE scale = :scale AND hillNumber IN (${inList})`,
    });

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
};

function unwrapHillRecords(response) {
  const hills = unwrapRecords(response);

  for (const hill of hills) {
    hill.countries = unwrapSetFieldValue(hill.countries);
    hill.lists = unwrapSetFieldValue(hill.lists);
  }

  return hills;
}
