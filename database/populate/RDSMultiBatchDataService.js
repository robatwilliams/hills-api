const BATCH_EXECUTE_PARAMETER_SETS_LIMIT = 1000;

module.exports = class RDSMultiBatchDataService {
  constructor(client) {
    this.client = client;
  }

  async batchExecuteStatement(params) {
    const { parameterSets } = params;

    if (!params.transactionId) {
      throw new Error('Must be used within a transaction');
    }

    const batches = chunk(parameterSets, BATCH_EXECUTE_PARAMETER_SETS_LIMIT);
    console.log(`Inserting ${parameterSets.length} records in ${batches.length} batches`);

    // One at a time to get the same order each time
    for (const [index, batch] of batches.entries()) {
      // eslint-disable-next-line no-await-in-loop
      await this.client
        .batchExecuteStatement({ ...params, parameterSets: batch })
        .promise();
      console.log(`Inserted batch ${index + 1}`);
    }

    console.log('Inserted all batches');
  }
};

function chunk(array, length) {
  const chunks = [];

  for (let startIndex = 0; startIndex < array.length; startIndex += length) {
    // eslint-disable-next-line no-shadow
    const chunk = array.slice(startIndex, startIndex + length);
    chunks.push(chunk);
  }

  return chunks;
}
