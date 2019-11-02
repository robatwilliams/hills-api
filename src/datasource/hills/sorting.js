function sortBy(sort, paginate) {
  const descending = paginate.backward ? 'ASC' : 'DESC';
  const ascending = paginate.backward ? 'DESC' : 'ASC';

  // Remember to update pagination/cursor code to handle new sorts!

  if (sort.height) {
    return `heightMetres ${sort.height.descending ? descending : ascending}`;
  }

  if (sort.namePrimary) {
    return `name.name ${sort.namePrimary.descending ? descending : ascending}`;
  }

  // Always return an expression, to reduce need for conditionals elsewhere
  return 'NULL';
}

module.exports = { sortBy };
