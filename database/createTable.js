const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const { getArguments, readFile } = require('./util');

const { region, clusterArn, clusterSecretArn } = getArguments();

const client = new RDSDataService({ region });

(async () => {
  console.log(await main());
})();

async function main() {
  const ddl = await readFile('./database/ddl/HILLS.sql', 'utf8');

  const params = {
    database: 'HILLS',
    resourceArn: clusterArn,
    secretArn: clusterSecretArn,
    sql: ddl,
  };

  return client.executeStatement(params).promise();
}
