module.exports = {
  resolvers: {},
  schema: [require('./schema/FloatCriterion'), require('./schema/StringMultiCriterion')],
  validationRules: [require('./criterionValidationRule')],
};
