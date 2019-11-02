const { toContainOneError } = require('./customMatchers/containOneError');

expect.extend({
  toContainOneError,
});
