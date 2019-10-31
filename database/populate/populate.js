/**
 * Bash command to shorten the data file for testing:
 *   sed --in-place '1001,$ d' data/DoBIH_v16_2.csv
 */
const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const csvParse = require('csv-parse/lib/sync');

const { flatten } = require('../../src/util');
const hillsType = require('../ddl/hills');
const hillsMapsType = require('../ddl/hills_maps');
const hillsNamesType = require('../ddl/hills_names');
const { getArguments, readFile } = require('../util');

const { createHillNamesParameters, createParameters } = require('./createParameters');
const parseHill = require('./parseHill');
const RDSMultiBatchDataService = require('./RDSMultiBatchDataService');

const DATA_FILE_PATH = './data/DoBIH_v16_2.csv';
const database = 'HILLS';

const { region, clusterArn: resourceArn, clusterSecretArn: secretArn } = getArguments();
const commonParams = { database, resourceArn, secretArn };

const client = new RDSDataService({ region });
const multiBatchClient = new RDSMultiBatchDataService(client);

(async () => {
  console.log(await main());
})();

async function main() {
  const hills = await loadHills();
  const { transactionId } = await client.beginTransaction(commonParams).promise();

  try {
    await insert(hills, transactionId);
    await commitTransaction(transactionId);
  } catch (error) {
    console.error('Error while inserting data. Rolling back transaction...', error);
    await rollbackTransaction(transactionId);

    throw new Error('Populate aborted due to error', error);
  }

  console.log('Populate complete');
}

async function commitTransaction(id) {
  const { transactionStatus } = await client
    .commitTransaction({ resourceArn, secretArn, transactionId: id })
    .promise();
  console.log(`Transaction committed. Status: ${transactionStatus}`);
}

async function rollbackTransaction(id) {
  const { transactionStatus } = await client
    .rollbackTransaction({ resourceArn, secretArn, transactionId: id })
    .promise();
  console.log(`Transaction rollback requested. Status: ${transactionStatus}`);
}

async function insert(hills, transactionId) {
  console.log('Inserting hills');
  await insertHills(hills, transactionId);

  console.log('Inserting hill names');
  await insertNames(hills, transactionId);

  console.log('Inserting hill-map associations');
  await insertMaps(hills, transactionId);
}

function insertHills(hills, transactionId) {
  const sql = createInsertStatement('HILLS', hillsType);
  const parameterSets = hills.map(hill => createParameters(hill, hillsType));

  return multiBatchClient.batchExecuteStatement({
    ...commonParams,
    parameterSets,
    sql,
    transactionId,
  });
}

function insertNames(hills, transactionId) {
  const sql = createInsertStatement('HILLS_NAMES', hillsNamesType);
  const parameterSets = flatten(
    hills.map(hill => createHillNamesParameters(hill, hillsNamesType))
  );

  return multiBatchClient.batchExecuteStatement({
    ...commonParams,
    parameterSets,
    sql,
    transactionId,
  });
}

function insertMaps(hills, transactionId) {
  const sql = createInsertStatement('HILLS_MAPS', hillsMapsType);

  const entities = hills.reduce((accumulator, hill) => {
    return [
      ...accumulator,
      ...hill.mapsScale25k.map(sheet => ({ hillNumber: hill.number, scale: 25, sheet })),
      ...hill.mapsScale50k.map(sheet => ({ hillNumber: hill.number, scale: 50, sheet })),
    ];
  }, []);

  const parameterSets = entities.map(entity => createParameters(entity, hillsMapsType));

  return multiBatchClient.batchExecuteStatement({
    ...commonParams,
    parameterSets,
    sql,
    transactionId,
  });
}

function createInsertStatement(table, entityType) {
  const columns = Object.keys(entityType);
  const columnList = columns.join(',');
  const parameterList = columns.map(column => `:${column}`).join(',');

  return `INSERT INTO ${table} (${columnList}) VALUES (${parameterList})`;
}

async function loadHills() {
  const records = await loadData();
  console.log(`Loaded ${records.length} records`);

  const hills = records.map(parseHill).filter(shouldInclude);
  console.log(`Filtered records down to ${hills.length} hills`);

  return hills;
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
  // Dataset exposed by the API is currently limited to major hill lists
  return hill.lists.length > 0;
}
