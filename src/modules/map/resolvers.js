module.exports = {
  Hill: {
    maps(hill, { scale }) {
      switch (scale) {
        case 'ONE_25K':
          return hill.maps.scale25k;
        case 'ONE_50K':
          return hill.maps.scale50k;
        default:
          throw new Error('Unknown scale ' + scale);
      }
    },
  },
};
