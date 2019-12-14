/* eslint-disable camelcase */
const convertCriterion = require('./convertCriterion');

test('greater than', () => {
  const criterion = { gt: 10 };

  expect(convertCriterion(criterion, 'myField')).toEqual({
    expressions: ['myField > :myField_gt'],
    parameters: { myField_gt: 10 },
  });
});

test('search', () => {
  const criterion = { search: 'pik' };

  const expectedExpression = `(
    myField LIKE CONCAT(:myField_search, '%')
    OR myField LIKE CONCAT('% ', :myField_search, '%')
  )`;

  expect(convertCriterion(criterion, 'myField')).toEqual({
    expression: expectedExpression,
    parameters: { myField_search: 'pik' },
  });
});
