/**
 * Bash command to shorten the data file for testing:
 *   sed --in-place '1001,$ d' data/DoBIH_v16_2.csv
 */
const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const csvParse = require('csv-parse/lib/sync');
const { getArguments, readFile } = require('../util');
const { createParameters, parameterNames } = require('./parameters');
const parseHill = require('./parseHill');

const DATA_FILE_PATH = './data/DoBIH_v16_2.csv';

const { region, clusterArn, clusterSecretArn } = getArguments();

const client = new RDSDataService({ region });

(async () => {
  console.log(await main());
})();

async function main() {
  const records = await loadData();
  console.log(`Loaded ${records.length} records`);

  const parameterSets = records
    .map(parseHill)
    .filter(shouldInclude)
    .map(createParameters);

  console.log(`Inserting ${parameterSets.length} items`);

  const params = {
    database: 'HILLS',
    parameterSets,
    resourceArn: clusterArn,
    secretArn: clusterSecretArn,
    sql: createInsertStatement(),
  };

  await client.batchExecuteStatement(params).promise();
  console.log('Insert complete');
}

function createInsertStatement() {
  const columnList = parameterNames.join(',');
  const parameterList = parameterNames.map(column => ':' + column).join(',');

  return `INSERT INTO HILLS (${columnList}) VALUES (${parameterList})`;
}

async function loadData() {
  const textContent = await readFile(DATA_FILE_PATH, 'utf8');

  const options = {
    cast: value => (value === '' ? undefined : value),
    columns: true,
  };

  return csvParse(textContent, options);
}

function shouldInclude(hill) {
  // Constrain data set for ease of handling and known quality
  return hill.lists.length > 0;
}
