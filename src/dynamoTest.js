const DynamoDB = require('aws-sdk/clients/dynamodb');

const client = new DynamoDB.DocumentClient({ region: 'us-east-1' });

function handler(event) {
  const params = {
    TableName: 'HILLS',
    Key: {
      number: Number(event.queryStringParameters.number),
    },
  };

  return client.get(params).promise();
}

module.exports.fn = handler;
