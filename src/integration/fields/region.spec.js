const gql = require('../graphql-tag-raw');
const { sendQueryOk } = require('../helpers');

test('region', async () => {
  const query = gql`
    {
      hill(number: 278) {
        region {
          name
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.region.name).toBe('Fort William to Loch Treig & Loch Leven');
});
