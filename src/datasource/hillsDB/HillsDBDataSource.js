const { performance } = require('perf_hooks');
const DynamoDB = require('aws-sdk/clients/dynamodb');
const mapHill = require('./mapHill');

const TableName = process.env.HILLS_TABLE_NAME;

class HillsDBDataSource {
  start() {
    this.client = new DynamoDB.DocumentClient(); // region from env:AWS_REGION
  }

  async query({ list }) {
    const params = { TableName };

    if (list !== undefined) {
      params.FilterExpression = 'contains (lists, :list)';
      params.ExpressionAttributeValues = { ':list': list };
    }

    const items = (await scan(this.client, params)).Items;
    return items.map(mapHill);
  }

  async queryOne({ number }) {
    const params = {
      TableName,
      Key: { number },
    };

    const item = (await this.client.get(params).promise()).Item;
    return item && mapHill(item);
  }
}

async function scan(client, params) {
  const startTime = performance.now();

  const response = await client
    .scan({ ...params, ReturnConsumedCapacity: 'TOTAL' })
    .promise();
  const duration = performance.now() - startTime;

  console.log('Table scan', {
    consumedCapacity: response.ConsumedCapacity,
    duration,
    scannedCount: response.ScannedCount,
    table: params.TableName,
  });

  return response;
}

module.exports = HillsDBDataSource;
