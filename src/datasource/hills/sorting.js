function sortBy(sort) {
  // Remember to update pagination/cursor code to handle new sorts!

  if (sort.height) {
    return `heightMetres ${sort.height.descending ? 'DESC' : 'ASC'}`;
  }

  if (sort.namePrimary) {
    return `name.name ${sort.namePrimary.descending ? 'DESC' : 'ASC'}`;
  }

  // Always return an expression, to reduce need for conditionals elsewhere
  return 'NULL';
}

module.exports = { sortBy };
