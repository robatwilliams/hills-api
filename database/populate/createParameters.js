module.exports = function createParameters(entity, entityType) {
  return Object.entries(entityType).map(([name, type]) => {
    return {
      name,
      value: wrapValue(entity[name], type),
    };
  });
};

function wrapValue(value, type) {
  if (typeof type === 'string') {
    return { [type]: value };
  }

  // SET data type
  const [elementType] = type;
  return {
    [elementType]: value.join(','),
  };
}
