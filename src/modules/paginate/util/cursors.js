/**
 * Opaque cursors:
 *   1. Allow storing additional information for sorting/pagination use.
 *   2. Discourage clients using them for anything else.
 */

function decodeJSONCursor(base64) {
  try {
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  } catch (error) {
    // GraphQL doesn't allow throwing from here without causing a HTTP 500.
    // Maybe we should have a "base64 encoded JSON" custom GraphQL data type,
    // to allow catching this at the validation stage.
    return null;
  }
}

function encodeJSONCursor(object) {
  return Buffer.from(JSON.stringify(object), 'utf8').toString('base64');
}

module.exports = {
  decodeJSONCursor,
  encodeJSONCursor,
};
