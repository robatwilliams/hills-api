const BATCH_EXECUTE_PARAMETER_SETS_LIMIT = 1000;

module.exports = class RDSMultiBatchDataService {
  constructor(client, staticParams) {
    this.client = client;
    this.staticParams = staticParams;
  }

  async batchExecuteStatement(params) {
    const { parameterSets } = params;

    const batches = chunk(parameterSets, BATCH_EXECUTE_PARAMETER_SETS_LIMIT);
    console.log(`Inserting ${parameterSets.length} records in ${batches.length} batches`);

    // One at a time, let it stop if anything fails
    for (const [index, batch] of batches.entries()) {
      await this._batchExecuteStatement({ ...params, parameterSets: batch });
      console.log(`Inserted batch ${index + 1}`);
    }

    console.log('Inserted all batches');
  }

  _batchExecuteStatement(params) {
    return this.client
      .batchExecuteStatement({ ...this.staticParams, ...params })
      .promise();
  }
};

function chunk(array, length) {
  const chunks = [];

  for (let startIndex = 0; startIndex < array.length; startIndex += length) {
    const chunk = array.slice(startIndex, startIndex + length);
    chunks.push(chunk);
  }

  return chunks;
}
