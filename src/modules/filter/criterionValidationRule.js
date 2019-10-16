/**
 * graphql-tools SchemaDirectiveVisitor might have been nicer, but it doesn't support
 * input types: https://github.com/apollographql/graphql-tools/issues/858
 *
 * Usage info gleaned from https://github.com/graphql/graphql-js/tree/master/src/validation/rules
 */
const { GraphQLError } = require('graphql');

const OPERATORS = ['inc'];

module.exports = function criterionValidationRule(context) {
  return {
    ObjectValue(node) {
      if (!context.getInputType().name.endsWith('Criterion')) {
        return;
      }

      const fieldNames = node.fields.map(field => field.name.value);

      if (fieldNames.length === 0) {
        context.reportError(new GraphQLError('Criterion must have an operator', node));
      } else if (!includesAll(OPERATORS, fieldNames)) {
        context.reportError(new GraphQLError('Unknown operator in criterion', node));
      }
    },
  };
};

function includesAll(haystack, needles) {
  return needles.every(needle => haystack.includes(needle));
}
