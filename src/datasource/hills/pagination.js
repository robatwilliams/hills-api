function paginateBy(paginate, sort) {
  const cursor = paginate.after || paginate.before;

  if (!cursor) {
    // Always return an expression, to reduce need for conditionals elsewhere
    return { expression: 'TRUE' };
  }

  if (sort.height) {
    return {
      expression: `heightMetres ${
        sort.height.descending ? '<' : '>'
      } :height OR (heightMetres = :height AND number ${
        paginate.after ? '>' : '<'
      } :number)`,
      parameters: {
        height: cursor.height,
        number: cursor.number,
      },
    };
  }

  if (sort.namePrimary) {
    return {
      expression: `name.name ${sort.namePrimary.descending ? '<' : '>'} :namePrimary`,
      parameters: { namePrimary: cursor.namePrimary },
    };
  }

  return {
    expression: `number ${paginate.after ? '>' : '<'} :number`,
    parameters: { number: cursor.number },
  };
}

module.exports = { paginateBy };
