const PageInfo = require('./model/PageInfo');
const { decodeNumericCursor, encodeNumericCursor } = require('./util/cursors');
const { buildEdges } = require('./util/edges');
const { setPaginateDefaults } = require('./util/defaultArguments');

module.exports = {
  resolvers: {},
  schema: [require('./schema/PageInfo')],
  validationRules: [require('./argumentsValidationRule')],

  buildEdges,
  decodeNumericCursor,
  encodeNumericCursor,
  PageInfo,
  setPaginateDefaults,
};
