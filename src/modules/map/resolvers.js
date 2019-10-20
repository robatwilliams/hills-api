const { createBatchResolver } = require('graphql-resolve-batch');

const Scale = require('./model/Scale');

module.exports = {
  Hill: {
    maps: createBatchResolver(async (hills, { scale }, { dataSources }) => {
      const numbers = hills.map(({ number }) => number);
      const scaleInt = convertScale(scale);

      const maps = await dataSources.hills.queryMaps({ numbers, scale: scaleInt });

      // Batch, so return an array (for each source/hill) of arrays (actual value)
      return hills.map(hill => findHillMaps(maps, hill));
    }),
  },
};

function findHillMaps(maps, hill) {
  return maps
    .filter(map => map.hillNumber === hill.number)
    .sort((a, b) => a.sheet.localeCompare(b.sheet));
}

function convertScale(scale) {
  switch (scale) {
    case Scale.ONE_25K:
      return 25;
    case Scale.ONE_50K:
      return 50;
    default:
      throw new Error(`Unknown scale: ${scale}`);
  }
}
