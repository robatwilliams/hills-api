function paginateBy(paginate) {
  const cursor = paginate.after || paginate.before;

  if (!cursor) {
    // Always return an expression, to reduce need for conditionals elsewhere
    return { expression: 'TRUE' };
  }

  const operator = paginate.after ? '>' : '<';

  return {
    expression: `number ${operator} :number`,
    parameters: { number: cursor.number },
  };
}

module.exports = { paginateBy };
