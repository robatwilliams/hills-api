const convertCriterion = require('./convertCriterion');

// eslint-disable-next-line max-statements
function filterWhere(filter) {
  const { country, heightFeet, heightMetres, list } = filter;

  const parameters = {};
  const conjunctions = [];

  if (country != null) {
    conjunctions.push('FIND_IN_SET(:country, countries)');
    parameters.country = country;
  }

  if (heightFeet != null) {
    addCriterion({ conjunctions, parameters }, heightFeet, 'heightFeet');
  }

  if (heightMetres != null) {
    addCriterion({ conjunctions, parameters }, heightMetres, 'heightMetres');
  }

  if (list != null) {
    conjunctions.push('FIND_IN_SET(:list, lists)');
    parameters.list = list;
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
