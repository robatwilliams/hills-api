/**
 * Bash command to shorten the data file for testing:
 *   sed --in-place '1001,$ d' data/DoBIH_v16_2.csv
 */
const RDSDataService = require('aws-sdk/clients/rdsdataservice');
const csvParse = require('csv-parse/lib/sync');
const hillsType = require('../ddl/hills');
const hillsMapsType = require('../ddl/hills_maps');
const { chunk, getArguments, readFile } = require('../util');
const createParameters = require('./createParameters');
const parseHill = require('./parseHill');

const BATCH_EXECUTE_PARAMETER_SETS_LIMIT = 1000;
const DATA_FILE_PATH = './data/DoBIH_v16_2.csv';

const { region, clusterArn, clusterSecretArn } = getArguments();

const client = new RDSDataService({ region });

(async () => {
  console.log(await main());
})();

async function main() {
  const records = await loadData();
  console.log(`Loaded ${records.length} records`);

  const hills = records.map(parseHill).filter(shouldInclude);

  console.log('Inserting hills');
  await insertHills(hills);

  console.log('Inserting hill-map associations');
  await insertMaps(hills);

  console.log('Populate complete');
}

function insertHills(hills) {
  const sql = createInsertStatement('HILLS', hillsType);
  const parameterSets = hills.map(hill => createParameters(hill, hillsType));

  return multiBatchExecuteStatement({ parameterSets, sql });
}

function insertMaps(hills) {
  const sql = createInsertStatement('HILLS_MAPS', hillsMapsType);

  const entities = hills.reduce((accumulator, hill) => {
    return [
      ...accumulator,
      ...hill.mapsScale25k.map(sheet => ({ hillNumber: hill.number, scale: 25, sheet })),
      ...hill.mapsScale50k.map(sheet => ({ hillNumber: hill.number, scale: 50, sheet })),
    ];
  }, []);

  const parameterSets = entities.map(entity => createParameters(entity, hillsMapsType));

  return multiBatchExecuteStatement({ parameterSets, sql });
}

function createInsertStatement(table, entityType) {
  const columns = Object.keys(entityType);
  const columnList = columns.join(',');
  const parameterList = columns.map(column => ':' + column).join(',');

  return `INSERT INTO ${table} (${columnList}) VALUES (${parameterList})`;
}

async function multiBatchExecuteStatement(params) {
  const { parameterSets } = params;

  const batches = chunk(parameterSets, BATCH_EXECUTE_PARAMETER_SETS_LIMIT);
  console.log(`Inserting ${parameterSets.length} records in ${batches.length} batches`);

  // One at a time, let it stop if anything fails
  for (const [index, batch] of batches.entries()) {
    await batchExecuteStatement({ ...params, parameterSets: batch });
    console.log(`Uploaded batch ${index + 1}`);
  }

  console.log('Uploaded all batches');
}

function batchExecuteStatement(params) {
  const staticParams = {
    database: 'HILLS',
    resourceArn: clusterArn,
    secretArn: clusterSecretArn,
  };

  return client.batchExecuteStatement({ ...staticParams, ...params }).promise();
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
