/**
 * Uploads the Hills Database CSV data into DynamoDB.
 *
 * Not using the DocumentClient; prefer explicitness in defining the schema.
 *
 * Bash command to shorten the data file for testing:
 *   sed --in-place '1001,$ d' data/DoBIH_v16_2.csv
 */
const fs = require('fs');
const util = require('util');
const csvParse = require('csv-parse/lib/sync');
const DynamoDB = require('aws-sdk/clients/dynamodb');
const createPutRequest = require('./createPutRequest');

const readFile = util.promisify(fs.readFile);

const BATCH_WRITE_ITEM_LIMIT = 25; // DynamoDB API limit
const DATA_FILE_PATH = './data/DoBIH_v16_2.csv';

const region = process.env.npm_config_AWS_REGION;
const stage = getStageArg();
console.log('Config', { region, stage });

const client = new DynamoDB({ region });

(async () => {
  console.log(await main());
})();

async function main() {
  const records = await loadData();
  console.log(`Loaded ${records.length} records`);

  // "Put" => overwrite existing items with same key
  const putRequests = records.map(createPutRequest).filter(shouldUpload);

  return upload(putRequests);
}

async function upload(putRequests) {
  const batches = chunk(putRequests, BATCH_WRITE_ITEM_LIMIT);
  console.log(`Uploading ${putRequests.length} items in ${batches.length} batches`);

  // One at a time, let it stop if anything fails
  for (const [index, batch] of batches.entries()) {
    const result = await batchWrite(batch);
    console.log(`Uploaded batch ${index + 1}; result:`, result);
  }

  console.log('Upload complete');
}

function batchWrite(items) {
  const request = {
    RequestItems: {
      [stage + '_HILLS']: items,
    },
  };

  return client.batchWriteItem(request).promise();
}

async function loadData() {
  const textContent = await readFile(DATA_FILE_PATH, 'utf8');

  const options = {
    cast: value => (value === '' ? undefined : value),
    columns: true,
  };

  return csvParse(textContent, options);
}

function shouldUpload(putRequest) {
  // Constrain data set for ease of handling and known quality
  const hillItem = putRequest.PutRequest.Item;
  return hillItem.lists != null;
}

function chunk(array, length) {
  const chunks = [];

  for (let startIndex = 0; startIndex < array.length; startIndex += length) {
    const chunk = array.slice(startIndex, startIndex + length);
    chunks.push(chunk);
  }

  return chunks;
}

function getStageArg() {
  const regionPattern = /^--r(egion)?=.+$/;
  const stagePattern = /^--s(tage)?=.+$/;

  const args = process.argv.slice(2);

  if (args.find(arg => regionPattern.test(arg))) {
    console.error('Region argument not currently supported');
    process.exit(1);
  }

  const stageArg = args.find(arg => stagePattern.test(arg));
  const stage = stageArg && stageArg.split('=', 2)[1];

  if (!stage) {
    console.error('Must provide stage name as argument. Received:', args);
    process.exit(1);
  }

  return stage;
}
