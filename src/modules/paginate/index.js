const PageInfo = require('./model/PageInfo');
const { decodeJSONCursor, encodeJSONCursor } = require('./util/cursors');
const { buildEdges } = require('./util/edges');
const { setPaginateDefaults } = require('./util/defaultArguments');

module.exports = {
  resolvers: {},
  schema: [require('./schema/PageInfo')],
  validationRules: [require('./argumentsValidationRule')],

  buildEdges,
  decodeJSONCursor,
  encodeJSONCursor,
  PageInfo,
  setPaginateDefaults,
};
