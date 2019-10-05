const fs = require('fs');
const util = require('util');
const RDSDataService = require('aws-sdk/clients/rdsdataservice');

const readFile = util.promisify(fs.readFile);

const { clusterArn, clusterSecretArn, region } = getArguments();

const client = new RDSDataService({ region });

(async () => {
  console.log(await main());
})();

async function main() {
  const ddl = await readFile('./database/ddl/HILLS.sql', 'utf8');

  const params = {
    database: 'HILLS_DEV',
    resourceArn: clusterArn,
    secretArn: clusterSecretArn,
    sql: ddl,
  };

  return client.executeStatement(params).promise();
}

function getArguments() {
  const [region, clusterArn, clusterSecretArn] = process.argv.slice(2);

  if (!region || !clusterArn || !clusterSecretArn) {
    console.error('Must specify: region, cluster ARN, cluster secret ARN');
    process.exit(1);
  }

  return { region, clusterArn, clusterSecretArn };
}
