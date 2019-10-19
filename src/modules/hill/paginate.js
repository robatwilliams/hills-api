function decodeCursor(base64) {
  return Number(Buffer.from(base64, 'base64').toString('utf8'));
}

function encodeCursor(number) {
  return Buffer.from(number.toString(), 'utf8').toString('base64');
}

module.exports = {
  decodeCursor,
  encodeCursor,
};
