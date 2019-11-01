const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

describe('parent', () => {
  it('returns it when hill has one', async () => {
    const query = gql`
      {
        hill(number: 2340) {
          names
          parent {
            names
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill).toEqual({
      names: ['Mungrisdale Common'],
      parent: {
        names: ['Blencathra - Hallsfell Top'],
      },
    });
  });

  it('returns null when hill does not have one', async () => {
    const query = gql`
      {
        hill(number: 278) {
          names
          parent {
            names
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill).toEqual({
      names: ['Ben Nevis', 'Beinn Nibheis'],
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
            names
            parent {
              names
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).toEqual([
      { names: ['Kirk Fell'], parent: null },
      { names: ['Green Gable'], parent: { names: ['Great Gable'] } },
      { names: ['High Raise (High Street)'], parent: { names: ['High Street'] } },
    ]);
  });
});
