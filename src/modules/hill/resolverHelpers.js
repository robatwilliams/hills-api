const { encodeNumericCursor } = require('../paginate');

const PAGINATION_LIMIT_DEFAULT = 10;

function computePageInfo(nodes, paginate, hasMore) {
  const lastNode = nodes[nodes.length - 1];

  return {
    endCursor: lastNode ? getHillCursor(lastNode) : null,
    startCursor: nodes[0] ? getHillCursor(nodes[0]) : null,

    /**
     * Only look in the direction of pagination; not implementing the optional part of
     * https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo .
     * Also returning null for the optional cases which is more accurate than false.
     */
    hasNextPage: paginate.first == null ? null : hasMore,
    hasPreviousPage: paginate.last == null ? null : hasMore,
  };
}

function getHillCursor(hill) {
  return encodeNumericCursor(hill.number);
}

function setPaginateDefaults(paginate) {
  if (paginate.first == null && paginate.last == null) {
    if (paginate.before) {
      paginate.last = PAGINATION_LIMIT_DEFAULT;
    } else {
      paginate.first = PAGINATION_LIMIT_DEFAULT;
    }
  }
}

module.exports = {
  computePageInfo,
  getHillCursor,
  setPaginateDefaults,
};
