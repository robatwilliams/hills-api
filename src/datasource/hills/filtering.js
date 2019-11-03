const convertCriterion = require('./convertCriterion');

// eslint-disable-next-line max-statements
function filterBy(filter) {
  const parameters = {};
  const conjunctions = [];

  if (filter.countryCodes) {
    conjunctions.push('FIND_IN_SET(:country, countries)');
    parameters.country = filter.countryCodes.inc;
  }

  if (filter.heightFeet) {
    addCriterion({ conjunctions, parameters }, filter.heightFeet, 'heightFeet');
  }

  if (filter.heightMetres) {
    addCriterion({ conjunctions, parameters }, filter.heightMetres, 'heightMetres');
  }

  if (filter.listIds) {
    conjunctions.push('FIND_IN_SET(:list, lists)');
    parameters.list = filter.listIds.inc;
  }

  if (filter.names) {
    addNameSearchCriterion({ conjunctions, parameters }, filter.names);
  }

  if (filter.numbers) {
    conjunctions.push(makeInListExpression(filter.numbers, 'number'));
  }

  if (filter.sectionCode) {
    addCriterion({ conjunctions, parameters }, filter.sectionCode, 'rhbSection');
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

function addNameSearchCriterion(target, criterion) {
  const sqlCriterion = convertCriterion(criterion, 'name');

  const expression = `
    EXISTS(
      SELECT NULL FROM HILLS_NAMES nameSub
      WHERE nameSub.hillNumber = hill.number
      AND ${sqlCriterion.expression}
    )
  `;

  target.conjunctions.push(expression);
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
