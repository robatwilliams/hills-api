const convertCriterion = require('./convertCriterion');

// eslint-disable-next-line max-statements
function filterWhere(filter) {
  const parameters = {};
  const conjunctions = [];

  if (filter.country != null) {
    conjunctions.push('FIND_IN_SET(:country, countries)');
    parameters.country = filter.country;
  }

  if (filter.heightFeet != null) {
    addCriterion({ conjunctions, parameters }, filter.heightFeet, 'heightFeet');
  }

  if (filter.heightMetres != null) {
    addCriterion({ conjunctions, parameters }, filter.heightMetres, 'heightMetres');
  }

  if (filter.list != null) {
    conjunctions.push('FIND_IN_SET(:list, lists)');
    parameters.list = filter.list;
  }

  if (filter.numbers != null) {
    const { numbers } = filter;

    if (numbers.length === 0) {
      conjunctions.push(0);
    } else {
      // Although documented, arrayValues isn't actually implemented.
      // Confirmed by https://github.com/jeremydaly/data-api-client#you-cant-send-in-an-array-of-values
      const inList = filter.numbers.join(',');

      conjunctions.push(`number in (${inList})`);
    }
  }

  // Always return an expression, to reduce need for conditionals elsewhere
  const expression = conjunctions.length === 0 ? 1 : `(${conjunctions.join(' AND ')})`;

  return { expression, parameters };
}

function addCriterion(target, criterion, columnName) {
  const sqlCriterion = convertCriterion(criterion, columnName);

  target.conjunctions.push(...sqlCriterion.expressions);
  Object.assign(target.parameters, sqlCriterion.parameters);
}

module.exports = { filterWhere };
