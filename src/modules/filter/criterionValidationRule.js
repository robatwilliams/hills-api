/**
 * Validations that the schema alone cannot do.
 *
 * graphql-tools SchemaDirectiveVisitor might have been nicer, but it doesn't support
 * input types: https://github.com/apollographql/graphql-tools/issues/858
 *
 * Usage info gleaned from https://github.com/graphql/graphql-js/tree/master/src/validation/rules
 */
const { GraphQLError } = require('graphql');

const COMPATIBILITY = {
  gt: ['lt', 'lte'],
  gte: ['lt', 'lte'],
  lt: ['gt', 'gte'],
  lte: ['gt', 'gte'],
  inc: [],
};

module.exports = function criterionValidationRule(context) {
  return {
    ObjectValue(node) {
      if (!context.getInputType().name.endsWith('Criterion')) {
        return;
      }

      const fieldNames = node.fields.map(field => field.name.value);

      if (fieldNames.length === 0) {
        context.reportError(new GraphQLError('Criterion must have an operator', node));
        // eslint-disable-next-line no-negated-condition
      } else if (!areOperatorsKnown(fieldNames)) {
        // Make sure we update the rule for any new operator added to the schema
        throw new Error('Unknown operator in criterion');
      } else {
        const incompatibles = incompatibleOperators(fieldNames).sort();

        if (incompatibles.length > 0) {
          context.reportError(
            new GraphQLError(
              `Incompatible operators in criterion: ${incompatibles.join(', ')}`,
              node
            )
          );
        }
      }
    },
  };
};

function areOperatorsKnown(operators) {
  const known = Object.keys(COMPATIBILITY);

  return includesAll(known, operators);
}

function incompatibleOperators(operators) {
  for (const subject of operators) {
    const compatibles = COMPATIBILITY[subject];
    const siblings = operators.filter(operator => operator !== subject);

    for (const sibling of siblings) {
      if (!compatibles.includes(sibling)) {
        return [subject, sibling];
      }
    }
  }

  return [];
}

function includesAll(haystack, needles) {
  return needles.every(needle => haystack.includes(needle));
}
