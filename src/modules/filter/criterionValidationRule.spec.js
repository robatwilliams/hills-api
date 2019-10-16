/* eslint-disable new-cap */
const { GraphQLError } = require('graphql');

const criterionValidationRule = require('./criterionValidationRule');

it('accepts "inc" on its own', () => {
  const { context, rule } = setup();

  rule.ObjectValue({
    fields: [{ name: { value: 'inc' } }],
  });

  expect(context.reportError).not.toHaveBeenCalled();
});

it('rejects when no operator', () => {
  const { context, rule } = setup();

  const object = { fields: [] };
  rule.ObjectValue(object);

  expectOneGraphQLError(context, 'Criterion must have an operator', object);
});

it('rejects unknown operator', () => {
  // Schema will catch it; this behaviour is to make sure we update the rule
  // when a new operator is added to the schema.
  const { context, rule } = setup();

  const object = {
    fields: [{ name: { value: 'abc' } }],
  };
  rule.ObjectValue(object);

  expectOneGraphQLError(context, 'Unknown operator in criterion', object);
});

it('ignores non-criterion objects', () => {
  const { context, rule } = setup('CriterionThisIsNot');

  const object = {
    // Would be invalid for a criterion
    fields: [{ name: { value: 'height' } }],
  };
  rule.ObjectValue(object);

  expect(context.reportError).not.toHaveBeenCalled();
});

function setup(typeName = 'MyCriterion') {
  const context = {
    getInputType: () => ({ name: typeName }),
    reportError: jest.fn(),
  };

  const rule = criterionValidationRule(context);

  return { context, rule };
}

function expectOneGraphQLError(context, message, node) {
  expect(context.reportError).toHaveBeenCalledTimes(1);
  expect(context.reportError).toHaveBeenCalledWith(expect.any(GraphQLError));
  expect(context.reportError).toHaveBeenCalledWith(
    expect.objectContaining({
      message,
      nodes: [node],
    })
  );
}
