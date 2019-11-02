function sortBy(sort) {
  const expressions = [];

  // Remember to update pagination/cursor code to handle new sorts!

  if (sort.height) {
    expressions.push(`heightMetres ${sort.height.descending ? 'DESC' : 'ASC'}`);
  }

  if (sort.namePrimary) {
    expressions.push(`name.name ${sort.namePrimary.descending ? 'DESC' : 'ASC'}`);
  }

  return expressions;
}

module.exports = { sortBy };
