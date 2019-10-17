/* eslint-disable new-cap */
const { GraphQLError } = require('graphql');

const criterionValidationRule = require('./criterionValidationRule');

it('accepts one known operator on its own', () => {
  const { context, rule } = setup();

  rule.ObjectValue({
    fields: [{ name: { value: 'inc' } }],
  });

  expect(context.reportError).not.toHaveBeenCalled();
});

it('accepts valid combination of operators', () => {
  const { context, rule } = setup();

  rule.ObjectValue({
    fields: [{ name: { value: 'gt' } }, { name: { value: 'lt' } }],
  });

  expect(context.reportError).not.toHaveBeenCalled();
});

it('rejects invalid combination of operators', () => {
  const { context, rule } = setup();

  const object = { fields: [{ name: { value: 'inc' } }, { name: { value: 'gt' } }] };
  rule.ObjectValue(object);

  expectOneGraphQLError(context, 'Incompatible operators in criterion: gt, inc', object);
});

it('rejects when no operator', () => {
  const { context, rule } = setup();

  const object = { fields: [] };
  rule.ObjectValue(object);

  expectOneGraphQLError(context, 'Criterion must have an operator', object);
});

it('throws error for unknown operator', () => {
  const { rule } = setup();

  const object = {
    fields: [{ name: { value: 'abc' } }],
  };

  expect(() => rule.ObjectValue(object)).toThrow(
    new Error('Unknown operator in criterion')
  );
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
