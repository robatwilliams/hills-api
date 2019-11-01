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

function findHillNames(allNames, hill) {
  const names = allNames.filter(name => name.hillNumber === hill.number);

  const primary = names.find(name => name.isPrimary);
  const alternates = names.filter(name => name !== primary);

  return [primary, ...alternates].map(name => name.name);
}

function getHillCursor(hill) {
  return encodeNumericCursor(hill.number);
}

module.exports = {
  buildDataSourceFilter,
  buildDataSourcePaginate,
  computePageInfo,
  findHillNames,
  getHillCursor,
};
