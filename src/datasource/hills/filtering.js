const convertCriterion = require('./convertCriterion');

// eslint-disable-next-line max-statements
function filterWhere(filters) {
  const { country, heightMetres, list } = filters;

  const parameters = {};
  const conjunctions = [];

  if (country !== undefined) {
    conjunctions.push('FIND_IN_SET(:country, countries)');
    parameters.country = country;
  }

  if (heightMetres !== undefined) {
    const sqlCriterion = convertCriterion(heightMetres, 'heightMetres');
    conjunctions.push(...sqlCriterion.expressions);
    Object.assign(parameters, sqlCriterion.parameters);
  }

  if (list !== undefined) {
    conjunctions.push('FIND_IN_SET(:list, lists)');
    parameters.list = list;
  }

  const whereClause = conjunctions.length > 0 && `WHERE ${conjunctions.join(' AND ')}`;

  return { parameters, whereClause };
}

module.exports = { filterWhere };
