const DOUBLE = 'doubleValue';
const LONG = 'longValue';
const STRING = 'stringValue';

const types = {
  countries: [STRING],
  heightFeet: DOUBLE,
  heightMetres: DOUBLE,
  lists: [STRING],
  name: STRING,
  number: LONG,
};

exports.parameterNames = Object.keys(types);

exports.createParameters = function(hill) {
  return Object.entries(types).map(([name, type]) => {
    return {
      name,
      value: wrapValue(hill[name], type),
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
