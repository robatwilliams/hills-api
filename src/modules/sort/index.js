module.exports = {
  resolvers: {},
  schema: [require('./schema/SortSpec')],
  validationRules: [require('./sortValidationRule')],
};
