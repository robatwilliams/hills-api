/**
 * Opaque cursors to discourage clients using them for anything else.
 */

function decodeCursor(base64) {
  return Number(Buffer.from(base64, 'base64').toString('utf8'));
}

function encodeCursor(hill) {
  return Buffer.from(hill.number.toString(), 'utf8').toString('base64');
}

module.exports = {
  decodeCursor,
  encodeCursor,
};
