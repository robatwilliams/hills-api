const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

describe('parent', () => {
  it('returns it when hill has one', async () => {
    const query = gql`
      {
        hill(number: 2340) {
          name
          parent {
            name
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill).toEqual({
      name: 'Mungrisdale Common',
      parent: {
        name: 'Blencathra - Hallsfell Top',
      },
    });
  });

  it('returns null when hill does not have one', async () => {
    const query = gql`
      {
        hill(number: 278) {
          name
          parent {
            name
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill).toEqual({
      name: 'Ben Nevis [Beinn Nibheis]',
      parent: null,
    });
  });

  it('returns the correct ones when querying multiple hills (batch resolver)', async () => {
    const query = gql`
      {
        hills(
          filter: {
            heightMetres: { gte: 801, lte: 802 }
            lists: { id: { inc: WAINWRIGHT } }
          }
        ) {
          nodes {
            name
            parent {
              name
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).toEqual([
      { name: 'Kirk Fell', parent: null },
      { name: 'Green Gable', parent: { name: 'Great Gable' } },
      { name: 'High Raise (High Street)', parent: { name: 'High Street' } },
    ]);
  });
});
