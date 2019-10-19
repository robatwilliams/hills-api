const PageInfo = require('./model/PageInfo');
const { decodeNumericCursor, encodeNumericCursor } = require('./util/cursors');
const { setPaginateDefaults } = require('./util/defaultArguments');

module.exports = {
  resolvers: {},
  schema: [require('./schema/PageInfo')],
  validationRules: [require('./argumentsValidationRule')],

  decodeNumericCursor,
  encodeNumericCursor,
  PageInfo,
  setPaginateDefaults,
};
