const fs = require('fs');
const util = require('util');

exports.chunk = function(array, length) {
  const chunks = [];

  for (let startIndex = 0; startIndex < array.length; startIndex += length) {
    const chunk = array.slice(startIndex, startIndex + length);
    chunks.push(chunk);
  }

  return chunks;
};

exports.getArguments = function() {
  const [region, clusterArn, clusterSecretArn] = process.argv.slice(2);

  if (!region || !clusterArn || !clusterSecretArn) {
    console.error('Must specify: region, cluster ARN, cluster secret ARN');
    process.exit(1);
  }

  const args = { region, clusterArn, clusterSecretArn };
  console.log('Config', { region });

  return args;
};

exports.readFile = util.promisify(fs.readFile);
