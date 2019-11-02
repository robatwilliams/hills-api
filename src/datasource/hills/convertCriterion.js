const operatorsByShortName = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

module.exports = function convertCriterion(criterion, columnName) {
  if (criterion.search) {
    return convertSearchCriterion(criterion, columnName);
  }

  const fieldCriteria = unwrapCriterion(criterion);

  const expressions = [];
  const parameters = {};

  for (const { operator, value } of fieldCriteria) {
    const paramName = `${columnName}_${operator}`;

    expressions.push(`${columnName} ${sqlOperator(operator)} :${paramName}`);
    parameters[paramName] = value;
  }

  return { expressions, parameters };
};

function unwrapCriterion(criterion) {
  const operators = Object.entries(criterion);

  return operators.map(([operator, value]) => ({ operator, value }));
}

function sqlOperator(shortName) {
  const operator = operatorsByShortName[shortName];

  if (!operator) {
    throw new Error(`Unknown operator: ${shortName}`);
  }

  return operator;
}

function convertSearchCriterion({ search }, columnName) {
  const paramName = `${columnName}_search`;

  const expression = `(
    ${columnName} = :${paramName}
    OR ${columnName} LIKE CONCAT(:${paramName}, '%')
    OR ${columnName} LIKE CONCAT('% ', :${paramName}, '%')
  )`;

  return {
    expression,
    parameters: {
      [paramName]: search,
    },
  };
}
