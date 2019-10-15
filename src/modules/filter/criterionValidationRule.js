const { GraphQLError } = require('graphql');

/**
 * graphql-tools SchemaDirectiveVisitor might have been nicer, but it doesn't support
 * input types: https://github.com/apollographql/graphql-tools/issues/858
 *
 * Usage info gleaned from https://github.com/graphql/graphql-js/tree/master/src/validation/rules
 */
module.exports = function criterionValidationRule(context) {
  return {
    ObjectValue(node) {
      if (!context.getInputType().name.endsWith('Criterion')) {
        return;
      }

      const fieldNames = node.fields.map(field => field.name.value);

      if (fieldNames.length === 0) {
        context.reportError(new GraphQLError('Criterion must have an operator', node));
      }
    },
  };
};
