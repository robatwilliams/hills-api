const { decodeNumericCursor, encodeNumericCursor } = require('./cursors');

module.exports = {
  decodeNumericCursor,
  encodeNumericCursor,
  resolvers: {},
  schema: [require('./schema/PageInfo')],
  validationRules: [require('./argumentsValidationRule')],
};
