const convertCriterion = require('./convertCriterion');

// eslint-disable-next-line max-statements
function filterBy(filter) {
  const parameters = {};
  const conjunctions = [];

  if (filter.country != null) {
    conjunctions.push('FIND_IN_SET(:country, countries)');
    parameters.country = filter.country;
  }

  if (filter.heightFeet) {
    addCriterion({ conjunctions, parameters }, filter.heightFeet, 'heightFeet');
  }

  if (filter.heightMetres) {
    addCriterion({ conjunctions, parameters }, filter.heightMetres, 'heightMetres');
  }

  if (filter.list != null) {
    conjunctions.push('FIND_IN_SET(:list, lists)');
    parameters.list = filter.list;
  }

  if (filter.numbers) {
    conjunctions.push(makeInListExpression(filter.numbers, 'number'));
  }

  if (filter.region) {
    addCriterion({ conjunctions, parameters }, filter.region, 'rhbSection');
  }

  // Always return an expression, to reduce need for conditionals elsewhere
  const expression =
    conjunctions.length === 0 ? 'TRUE' : `(${conjunctions.join(' AND ')})`;

  return { expression, parameters };
}

function addCriterion(target, criterion, columnName) {
  const sqlCriterion = convertCriterion(criterion, columnName);

  target.conjunctions.push(...sqlCriterion.expressions);
  Object.assign(target.parameters, sqlCriterion.parameters);
}

function makeInListExpression(values, columnName) {
  if (values.length === 0) {
    return 'FALSE';
  }

  // Although documented, arrayValues isn't actually implemented, so can't use parameters.
  // Confirmed by https://github.com/jeremydaly/data-api-client#you-cant-send-in-an-array-of-values
  const inList = values.join(',');

  return `${columnName} IN (${inList})`;
}

module.exports = {
  filterBy,
  makeInListExpression,
};
