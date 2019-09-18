const DynamoDB = require('aws-sdk/clients/dynamodb');
const mapHill = require('./mapHill');

class HillsDBDataSource {
  start() {
    this.client = new DynamoDB.DocumentClient({ region: 'us-east-1' });
  }

  // eslint-disable-next-line no-unused-vars
  async query({ list }) {
    throw new Error('Not implemented');
  }

  async queryOne({ number }) {
    const params = {
      TableName: 'HILLS',
      Key: { number },
    };

    const item = (await this.client.get(params).promise()).Item;
    return item && mapHill(item);
  }
}

module.exports = HillsDBDataSource;
