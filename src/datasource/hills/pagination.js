// Not very elegant, but until we have more sort fields, it works and is clearer
function paginateBy(paginate, sort) {
  const cursor = paginate.after || paginate.before;

  if (!cursor) {
    // Always return an expression, to reduce need for conditionals elsewhere
    return { expression: 'TRUE' };
  }

  const { gt, lt } = getCompensatedOperators(paginate);

  const numberExpression = `number ${paginate.after ? '>' : '<'} :number`;

  if (sort.height) {
    return {
      // It's a different height...
      // OR it's the same height AND beyond the previous page
      expression: `(
        heightMetres ${sort.height.descending ? lt : gt} :height
        OR (heightMetres = :height AND ${numberExpression})
      )`,
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

function getCompensatedOperators(paginate) {
  return {
    gt: paginate.backward ? '<' : '>',
    lt: paginate.backward ? '>' : '<',
  };
}

module.exports = { paginateBy };
