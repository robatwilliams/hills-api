const { encodeNumericCursor, PageInfo } = require('../paginate');

function computePageInfo(nodes, paginate, hasMore) {
  return PageInfo.compute({ getNodeCursor: getHillCursor, hasMore, nodes, paginate });
}

function getHillCursor(hill) {
  return encodeNumericCursor(hill.number);
}

module.exports = {
  computePageInfo,
  getHillCursor,
};
