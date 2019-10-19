function paginateBy(paginate) {
  const cursor = paginate.after || paginate.before;

  if (!cursor) {
    // Always return an expression, to reduce need for conditionals elsewhere
    return { expression: 1 };
  }

  const operator = paginate.after ? '>' : '<';

  return {
    expression: `number ${operator} :cursor`,
    parameters: { cursor },
  };
}

module.exports = { paginateBy };
