const { sendQueryOk } = require('./helpers');

test('by list', async () => {
  const query = `{
    hills(list: WAINWRIGHT) { name }
  }`;

  const data = await sendQueryOk(query);

  expect(data.hills).toHaveLength(214);
  expect(data.hills).toEqual(
    // Wainwright only
    expect.arrayContaining([expect.objectContaining({ name: 'Bakestall' })])
  );
  expect(data.hills).toEqual(
    // Wainwright and Hewitt
    expect.arrayContaining([expect.objectContaining({ name: 'Skiddaw' })])
  );
  expect(data.hills).toEqual(
    expect.not.arrayContaining([expect.objectContaining({ name: 'Ben Lomond' })])
  );
});
