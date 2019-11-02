/**
 * Validations that the schema alone cannot do.
 *
 * See links to docs on criterionValidationRule.js
 */
const { GraphQLError } = require('graphql');

module.exports = function sortValidationRule(context) {
  return {
    ObjectValue(node) {
      if (!context.getInputType() || !context.getInputType().name.endsWith('Sort')) {
        return;
      }

      if (node.fields.length > 1) {
        context.reportError(
          new GraphQLError('Sorting is only supported on one field at a time', node)
        );
      }
    },
  };
};
