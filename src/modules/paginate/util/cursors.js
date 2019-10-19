/**
 * Opaque cursors to discourage clients using them for anything else.
 */

function decodeNumericCursor(base64) {
  return Number(Buffer.from(base64, 'base64').toString('utf8'));
}

function encodeNumericCursor(number) {
  return Buffer.from(number.toString(), 'utf8').toString('base64');
}

module.exports = {
  decodeNumericCursor,
  encodeNumericCursor,
};
