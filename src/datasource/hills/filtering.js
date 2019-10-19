const convertCriterion = require('./convertCriterion');

// eslint-disable-next-line max-statements
function filterWhere(filter) {
  const { country, heightFeet, heightMetres, list } = filter;

  const parameters = {};
  const conjunctions = [];

  if (country !== undefined) {
    conjunctions.push('FIND_IN_SET(:country, countries)');
    parameters.country = country;
  }

  if (heightFeet !== undefined) {
    addCriterion({ conjunctions, parameters }, heightFeet, 'heightFeet');
  }

  if (heightMetres !== undefined) {
    addCriterion({ conjunctions, parameters }, heightMetres, 'heightMetres');
  }

  if (list !== undefined) {
    conjunctions.push('FIND_IN_SET(:list, lists)');
    parameters.list = list;
  }

  return { conjunctions, parameters };
}

function addCriterion(target, criterion, columnName) {
  const sqlCriterion = convertCriterion(criterion, columnName);

  target.conjunctions.push(...sqlCriterion.expressions);
  Object.assign(target.parameters, sqlCriterion.parameters);
}

module.exports = { filterWhere };
