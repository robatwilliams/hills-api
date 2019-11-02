function paginateBy(paginate, sort) {
  const cursor = paginate.after || paginate.before;

  if (!cursor) {
    // Always return an expression, to reduce need for conditionals elsewhere
    return { expression: 'TRUE' };
  }

  const gt = paginate.backward ? '<' : '>';
  const lt = paginate.backward ? '>' : '<';

  const numberExpression = `number ${paginate.after ? '>' : '<'} :number`;

  if (sort.height) {
    // It's a different height...
    // OR it's the same height AND beyond the previous page
    const expression = `(
      heightMetres ${sort.height.descending ? lt : gt} :height
      OR (heightMetres = :height AND ${numberExpression})
    )`;

    return {
      expression,
      parameters: {
        height: cursor.height,
        number: cursor.number,
      },
    };
  }

  if (sort.namePrimary) {
    return {
      expression: `name.name ${sort.namePrimary.descending ? lt : gt} :namePrimary`,
      parameters: { namePrimary: cursor.namePrimary },
    };
  }

  return {
    expression: numberExpression,
    parameters: { number: cursor.number },
  };
}

module.exports = { paginateBy };
