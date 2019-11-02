module.exports = {
  resolvers: {},
  schema: [
    require('./schema/FloatCriterion'),
    require('./schema/StringMultiCriterion'),
    require('./schema/StringSingleCriterion'),
  ],
  validationRules: [require('./criterionValidationRule')],
};
