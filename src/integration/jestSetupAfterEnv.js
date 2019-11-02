/* eslint-disable prefer-template */
expect.extend({
  toContainOneError(response, expectedMessage) {
    if (this.isNot || this.promise) {
      throw new Error('Negation and promises not implemented for this matcher');
    }

    const pass =
      response.data.errors &&
      response.data.errors.length === 1 &&
      response.data.errors[0].message === expectedMessage;

    return {
      pass,
      message: () =>
        this.utils.matcherHint('toContainOneError') +
        '\n\n' +
        `Expected one error with message: ${this.utils.printExpected(
          expectedMessage
        )}\n` +
        `Received errors: ${this.utils.printReceived(response.data.errors)}`,
    };
  },
});
