/**
 * Validations that the schema alone cannot do: mutually-exclusive fields.
 *
 * Usage info:
 *   https://github.com/graphql/graphql-js/tree/master/src/validation/rules
 *   https://graphql.org/graphql-js/language/#visitor
 */
const { GraphQLError } = require('graphql');

module.exports = function paginationArgumentsValidationRule(context) {
  const fieldsArgumentsStack = [];

  return {
    Field: {
      enter() {
        fieldsArgumentsStack.unshift(Object.create(null));
      },

      leave(node) {
        const fieldArgNames = fieldsArgumentsStack.shift();

        const message =
          validateCompatibility(fieldArgNames) || validateLimits(fieldArgNames);

        if (message) {
          context.reportError(new GraphQLError(message, node));
        }
      },
    },
    Argument(node) {
      const [fieldArgNames] = fieldsArgumentsStack;

      const name = node.name.value;
      fieldArgNames[name] = node;
    },
  };
};

function validateCompatibility({ first, after, last, before }) {
  if (first && last) {
    return 'Limits given for both forward and backward pagination';
  } else if (after && before) {
    return 'Cursors given for both forward and backward pagination';
  } else if (before && first) {
    return 'Backward pagination cursor given with forward pagination limit';
  } else if (after && last) {
    return 'Forward pagination cursor given with backward pagination limit';
  }

  return undefined;
}

function validateLimits({ first, last }) {
  const limitNode = first || last;

  if (limitNode && limitNode.value.value.startsWith('-')) {
    return 'Negative pagination limit given';
  }

  return undefined;
}
