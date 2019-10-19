/**
 * Validations that the schema alone cannot do: mutually-exclusive fields.
 *
 * Usage info:
 *   https://github.com/graphql/graphql-js/tree/master/src/validation/rules
 *   https://graphql.org/graphql-js/language/#visitor
 */
const { GraphQLError } = require('graphql');

module.exports = function argumentsValidationRule(context) {
  const fieldsArgumentsStack = [];

  return {
    Field: {
      enter() {
        fieldsArgumentsStack.unshift(Object.create(null));
      },

      leave(node) {
        const fieldArgNames = fieldsArgumentsStack.shift();
        const { first, after, last, before } = fieldArgNames;

        let message;

        if (first && last) {
          message = 'Limits given for both forward and backward pagination';
        } else if (after && before) {
          message = 'Cursors given for both forward and backward pagination';
        } else if (before && first) {
          message = 'Backward pagination cursor given with forward pagination limit';
        } else if (after && last) {
          message = 'Forward pagination cursor given with backward pagination limit';
        }

        if (message) {
          context.reportError(new GraphQLError(message, node));
        }
      },
    },
    Argument(node) {
      const [fieldArgNames] = fieldsArgumentsStack;

      const name = node.name.value;
      fieldArgNames[name] = true;
    },
  };
};
