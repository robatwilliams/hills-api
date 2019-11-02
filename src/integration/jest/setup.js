const path = require('path');

const dotenv = require('dotenv');

const result = dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

if (result.error) {
  throw result.error;
}
