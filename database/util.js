const fs = require('fs');
const util = require('util');

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
