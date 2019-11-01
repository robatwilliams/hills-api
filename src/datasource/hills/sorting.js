function sortBy(sort) {
  const expressions = [];

  if (sort.namePrimary) {
    expressions.push(`name.name ${sort.namePrimary.descending ? 'DESC' : 'ASC'}`);
  }

  return expressions;
}

module.exports = { sortBy };
