function filterWhere({ country, list }) {
  const parameters = {};
  const conjunctions = [];

  if (country !== undefined) {
    conjunctions.push('FIND_IN_SET(:country, countries)');
    parameters.country = country;
  }

  if (list !== undefined) {
    conjunctions.push('FIND_IN_SET(:list, lists)');
    parameters.list = list;
  }

  const whereClause = conjunctions.length > 0 && `WHERE ${conjunctions.join(' AND ')}`;

  return { parameters, whereClause };
}

module.exports = { filterWhere };
