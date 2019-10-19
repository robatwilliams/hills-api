module.exports = {
  resolvers: {},
  schema: [require('./schema/PageInfo')],
  validationRules: [require('./paginationValidationRule')],
};
