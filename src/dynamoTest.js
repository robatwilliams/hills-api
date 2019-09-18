const DynamoDB = require('aws-sdk/clients/dynamodb');

const client = new DynamoDB.DocumentClient({ region: 'us-east-1' });

async function handler(event) {
  const params = {
    TableName: 'HILLS',
    Key: {
      number: Number(event.queryStringParameters.number),
    },
  };

  const hill = await client.get(params).promise();

  return {
    statusCode: '200',
    body: JSON.stringify(hill),
  };
}

module.exports.fn = handler;
