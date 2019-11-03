const { toContainHillNamed } = require('./customMatchers/containHillNamed');
const { toContainOneError } = require('./customMatchers/containOneError');

expect.extend({
  toContainHillNamed,
  toContainOneError,
});
