const { decodeNumericCursor, encodeNumericCursor, PageInfo } = require('../paginate');

function buildDataSourceFilter(filter) {
  return {
    country: filter.countries && filter.countries.code.inc,
    heightFeet: filter.heightFeet,
    heightMetres: filter.heightMetres,
    list: filter.lists && filter.lists.id.inc,
  };
}

function buildDataSourcePaginate(paginate) {
  const { first, last } = paginate;
  const limit = first == null ? last : first;

  return {
    limit,
    before: paginate.before && decodeNumericCursor(paginate.before),
    after: paginate.after && decodeNumericCursor(paginate.after),
    backward: limit === last,
  };
}

function computePageInfo(nodes, paginate, hasMore) {
  return PageInfo.compute({ getNodeCursor: getHillCursor, hasMore, nodes, paginate });
}

function getHillCursor(hill) {
  return encodeNumericCursor(hill.number);
}

module.exports = {
  buildDataSourceFilter,
  buildDataSourcePaginate,
  computePageInfo,
  getHillCursor,
};
