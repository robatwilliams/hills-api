const gql = require('../graphql-tag-raw');
const { sendQueryOk } = require('../helpers');

test('in metres', async () => {
  const query = gql`
    {
      hill(number: 278) {
        height(unit: METRES)
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.height).toBe(1344.53);
});

test('in feet', async () => {
  const query = gql`
    {
      hill(number: 278) {
        height(unit: FEET)
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.height).toBe(4411);
});
