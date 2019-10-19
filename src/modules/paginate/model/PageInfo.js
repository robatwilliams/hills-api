module.exports = class PageInfo {
  static compute({ nodes, paginate, hasMore, getNodeCursor }) {
    const lastNode = nodes[nodes.length - 1];

    return {
      endCursor: lastNode ? getNodeCursor(lastNode) : null,
      startCursor: nodes[0] ? getNodeCursor(nodes[0]) : null,

      /**
       * Only look in the direction of pagination; not implementing the optional part of
       * https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo .
       * Also returning null for the optional cases which is more accurate than false.
       */
      hasNextPage: paginate.first == null ? null : hasMore,
      hasPreviousPage: paginate.last == null ? null : hasMore,
    };
  }
};
