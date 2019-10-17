module.exports = {
  resolvers: {},
  schema: [require('./schema/FloatCriterion'), require('./schema/StringCriterion')],
  validationRules: [require('./criterionValidationRule')],
};
