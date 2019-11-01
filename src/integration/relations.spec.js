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

    expect(data.hill.names.primary).toBe('Mungrisdale Common');
    expect(data.hill.parent.names.primary).toBe('Blencathra - Hallsfell Top');
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

    expect(data.hill.names.primary).toBe('Ben Nevis');
    expect(data.hill.parent).toBeNull();
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

    expect(data.hills.nodes).toHaveLength(3);
    expect(data.hills.nodes[0]).toEqual({
      names: { primary: 'Kirk Fell' },
      parent: null,
    });
    expect(data.hills.nodes[1]).toEqual({
      names: { primary: 'Green Gable' },
      parent: {
        names: { primary: 'Great Gable' },
      },
    });
    expect(data.hills.nodes[2]).toEqual({
      names: { primary: 'High Raise (High Street)' },
      parent: {
        names: { primary: 'High Street' },
      },
    });
  });
});
