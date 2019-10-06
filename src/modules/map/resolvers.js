const { createBatchResolver } = require('graphql-resolve-batch');

module.exports = {
  Hill: {
    maps: createBatchResolver(async (hills, { scale }, { dataSources }) => {
      const numbers = hills.map(({ number }) => number);
      const scaleInt = convertScale(scale);

      const maps = await dataSources.hills.queryMaps({ numbers, scale: scaleInt });

      // Batch, so return an array (for each source/hill) of arrays (actual value)
      return hills.map(hill => maps.filter(map => map.hillNumber === hill.number));
    }),
  },
};

function convertScale(scale) {
  switch (scale) {
    case 'ONE_25K':
      return 25;
    case 'ONE_50K':
      return 50;
    default:
      throw new Error('Unknown scale ' + scale);
  }
}
