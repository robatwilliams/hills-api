const gql = require('../graphql-tag-raw');
const { sendQueryOk } = require('../helpers');

test('geodetic', async () => {
  const query = gql`
    {
      hill(number: 278) {
        coordinates {
          geodetic {
            latitude
            longitude
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  // This hill has the highest precision lat/long
  expect(data.hill.coordinates.geodetic).toEqual({
    latitude: 56.796891,
    longitude: -5.003675, // West of the prime meridian
  });
});

test('grid: Britain', async () => {
  const query = gql`
    {
      hill(number: 278) {
        coordinates {
          grid {
            easting
            northing
            square
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.coordinates.grid).toEqual({
    easting: 166,
    northing: 712,
    square: 'NN',
  });
});

test('grid: Ireland', async () => {
  const query = gql`
    {
      hill(number: 20001) {
        coordinates {
          grid {
            easting
            northing
            square
          }
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.coordinates.grid).toEqual({
    easting: 803,
    northing: 844,
    square: 'V',
  });
});
