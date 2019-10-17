/* eslint-disable camelcase */
const convertCriterion = require('./convertCriterion');

test('greater than', () => {
  const criterion = { gt: 10 };

  expect(convertCriterion(criterion, 'myField')).toEqual({
    expressions: ['myField > :myField_gt'],
    parameters: { myField_gt: 10 },
  });
});
