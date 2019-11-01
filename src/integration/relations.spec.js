const gql = require('./graphql-tag-raw');
const { sendQueryOk } = require('./helpers');

describe('parent', () => {
  it('returns it when hill has one', async () => {
    const query = gql`
      {
        hill(number: 2340) {
          names {
            primary
          }
          parent {
            names {
              primary
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill).toEqual({
      names: { primary: 'Mungrisdale Common' },
      parent: {
        names: { primary: 'Blencathra - Hallsfell Top' },
      },
    });
  });

  it('returns null when hill does not have one', async () => {
    const query = gql`
      {
        hill(number: 278) {
          names {
            primary
          }
          parent {
            names {
              primary
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hill).toEqual({
      names: { primary: 'Ben Nevis' },
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
            names {
              primary
            }
            parent {
              names {
                primary
              }
            }
          }
        }
      }
    `;

    const data = await sendQueryOk(query);

    expect(data.hills.nodes).toEqual([
      { names: { primary: 'Kirk Fell' }, parent: null },
      {
        names: { primary: 'Green Gable' },
        parent: {
          names: { primary: 'Great Gable' },
        },
      },
      {
        names: { primary: 'High Raise (High Street)' },
        parent: {
          names: { primary: 'High Street' },
        },
      },
    ]);
  });
});
