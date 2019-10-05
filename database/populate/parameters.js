const DOUBLE = 'doubleValue';
const LONG = 'longValue';
const STRING = 'stringValue';

const types = {
  heightFeet: DOUBLE,
  heightMetres: DOUBLE,
  name: STRING,
  number: LONG,
};

exports.parameterNames = Object.keys(types);

exports.createParameters = function(hill) {
  return Object.entries(types).map(([name, type]) => {
    return {
      name,
      value: {
        [type]: hill[name],
      },
    };
  });
};
