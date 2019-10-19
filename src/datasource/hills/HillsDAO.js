const RDSDataService = require('aws-sdk/clients/rdsdataservice');

const { filterWhere } = require('./filtering');
const { paginateBy } = require('./pagination');
const { buildParameters, unwrapRecords, unwrapSetFieldValue } = require('./rdsApiUtil');

module.exports = class HillsDAO {
  constructor() {
    this.client = new RDSDataService(); // region from env:AWS_REGION
  }

  async query(filter, paginate) {
    const filterExpression = filterWhere(filter);
    const paginateExpression = paginateBy(paginate);

    const conjunctions = [filterExpression.expression, paginateExpression.expression];

    const parameters = {
      ...filterExpression.parameters,
      ...paginateExpression.parameters,
      limit: paginate.limit,
    };

    // Always include number in order-by, for stable pagination
    const statement = `
      SELECT * FROM HILLS
      ${conjunctions.length === 0 ? '' : `WHERE ${conjunctions.join(' AND ')}`}
      ORDER BY number ${paginate.backward ? 'DESC' : 'ASC'}
      LIMIT :limit`;

    const response = await this.executeStatement({
      parameters: buildParameters(parameters),
      sql: statement,
    });

    const hills = unwrapHillRecords(response);

    return paginate.backward ? hills.reverse() : hills;
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
