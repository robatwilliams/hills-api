const RDSDataService = require('aws-sdk/clients/rdsdataservice');

const { getArguments, readFile } = require('./util');

const { region, clusterArn, clusterSecretArn } = getArguments();

const client = new RDSDataService({ region });

(async () => {
  console.log(await main());
})();

async function main() {
  // This would ideally be done in a transaction
  await createTable('./database/ddl/HILLS.sql');
  await createTable('./database/ddl/HILLS_MAPS.sql');
  await createTable('./database/ddl/HILLS_NAMES.sql');

  console.log('Tables created');
}

async function createTable(ddlFilePath) {
  const ddl = await readFile(ddlFilePath, 'utf8');

  const params = {
    database: 'HILLS',
    resourceArn: clusterArn,
    secretArn: clusterSecretArn,
    sql: ddl,
  };

  return client.executeStatement(params).promise();
}
