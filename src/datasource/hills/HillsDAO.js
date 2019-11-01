const RDSDataService = require('aws-sdk/clients/rdsdataservice');

const { filterBy, makeInListExpression } = require('./filtering');
const { paginateBy } = require('./pagination');
const { sortBy } = require('./sorting');
const { buildParameters, unwrapRecords, unwrapSetFieldValue } = require('./rdsApiUtil');

module.exports = class HillsDAO {
  constructor() {
    this.client = new RDSDataService(); // region from env:AWS_REGION
  }

  async query(filter, sort, paginate) {
    const filterExpression = filterBy(filter);
    const paginateExpression = paginateBy(paginate);

    const conjunctions = [filterExpression.expression, paginateExpression.expression];

    const parameters = {
      ...filterExpression.parameters,
      ...paginateExpression.parameters,
      limit: paginate.limit,
    };

    const sortExpressions = [
      ...sortBy(sort),

      // Always include number, for stable pagination
      `number ${paginate.backward ? 'DESC' : 'ASC'}`,
    ];

    const statement = `
      SELECT * FROM HILLS hill
      LEFT JOIN HILLS_NAMES name
        ON hill.number = name.hillNumber
        AND name.isPrimary = TRUE
      WHERE ${conjunctions.join(' AND ')}
      ORDER BY ${sortExpressions.join(', ')}
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
    const inExpression = makeInListExpression(numbers, 'hillNumber');

    const response = await this.executeStatement({
      parameters: buildParameters({ scale }),
      sql: `SELECT hillNumber, sheet FROM HILLS_MAPS WHERE scale = :scale AND ${inExpression}`,
    });

    return unwrapRecords(response);
  }

  async queryNames({ numbers }) {
    const inExpression = makeInListExpression(numbers, 'hillNumber');

    const response = await this.executeStatement({
      sql: `SELECT hillNumber, isPrimary, name FROM HILLS_NAMES WHERE ${inExpression}`,
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
