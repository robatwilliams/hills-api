function createParameters(entity, entityType) {
  return Object.entries(entityType).map(([name, type]) =>
    createParameter(entity, name, type)
  );
}

function createHillNamesParameters(hill, hillsNamesType) {
  return hill.names.map((name, index) =>
    createParameters(
      {
        hillNumber: hill.number,
        isPrimary: index === 0,
        name,
      },
      hillsNamesType
    )
  );
}

function createParameter(entity, name, type) {
  try {
    return {
      name,
      value: wrapValue(entity[name], type),
    };
  } catch (error) {
    const details = JSON.stringify({ entity, name });
    throw new Error(`Error creating parameter for  ${details}: ${error.message}`);
  }
}

function wrapValue(value, type) {
  if (typeof type === 'string') {
    return value == null ? { isNull: true } : { [type]: value };
  }

  // SET data type
  const [elementType] = type;

  return {
    [elementType]: value.join(','),
  };
}

module.exports = {
  createHillNamesParameters,
  createParameters,
};
