const gql = require('../graphql-tag-raw');
const { sendQueryOk } = require('../helpers');

test('appearing only on one', async () => {
  const query = gql`
    {
      hill(number: 2320) {
        maps(scale: ONE_50K) {
          sheet
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.maps).toEqual([{ sheet: '90' }]);
});

test('appearing on multiple', async () => {
  const query = gql`
    {
      hill(number: 2405) {
        maps(scale: ONE_50K) {
          sheet
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.maps).toEqual([{ sheet: '89' }, { sheet: '90' }]);
});

test('OL Explorer sub-series', async () => {
  const query = gql`
    {
      hill(number: 2412) {
        maps(scale: ONE_25K) {
          sheet
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.maps).toEqual([{ sheet: 'OL4' }]);
});

test('sheet number omits location-on-sheet suffix present in source data', async () => {
  const query = gql`
    {
      hill(number: 2412) {
        maps(scale: ONE_25K) {
          sheet
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  // Source data: "OL4S"
  expect(data.hill.maps).toEqual([{ sheet: 'OL4' }]);
});

test('no duplicate sheet when sheet number listed twice in source data with location suffix', async () => {
  const query = gql`
    {
      hill(number: 71) {
        maps(scale: ONE_25K) {
          sheet
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  // Source data: "OL39N OL39S 364N 364S"
  expect(data.hill.maps).toEqual([{ sheet: '364' }, { sheet: 'OL39' }]);
});

test('Ireland 1:50k - Discovery Series by OS Ireland', async () => {
  const query = gql`
    {
      hill(number: 20001) {
        maps(scale: ONE_50K) {
          sheet
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.maps).toEqual([{ sheet: '78' }]);
});

test('Ireland missing 1:25k maps', async () => {
  const query = gql`
    {
      hill(number: 20001) {
        maps(scale: ONE_25K) {
          sheet
        }
      }
    }
  `;

  const data = await sendQueryOk(query);

  expect(data.hill.maps).toHaveLength(0);
});
