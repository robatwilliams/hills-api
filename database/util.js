const fs = require('fs');
const util = require('util');

exports.getArguments = function() {
  const [region, stage, clusterArn, clusterSecretArn] = process.argv.slice(2);

  if (!region || !stage || !clusterArn || !clusterSecretArn) {
    console.error('Must specify: region, stage, cluster ARN, cluster secret ARN');
    process.exit(1);
  }

  const args = { region, stage, clusterArn, clusterSecretArn };
  console.log('Config', { region, stage });

  return args;
};

exports.readFile = util.promisify(fs.readFile);
