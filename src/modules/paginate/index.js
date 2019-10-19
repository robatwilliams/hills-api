const PageInfo = require('./model/PageInfo');
const { decodeNumericCursor, encodeNumericCursor } = require('./cursors');
const { setPaginateDefaults } = require('./defaultArguments');

module.exports = {
  resolvers: {},
  schema: [require('./schema/PageInfo')],
  validationRules: [require('./argumentsValidationRule')],

  decodeNumericCursor,
  encodeNumericCursor,
  PageInfo,
  setPaginateDefaults,
};
