const { mapValues } = require('../../util');
const { decodeJSONCursor, encodeJSONCursor, PageInfo } = require('../paginate');

function buildDataSourceFilter(filter, dataSources) {
  return {
    country: filter.countries && filter.countries.code.inc,
    heightFeet: filter.heightFeet,
    heightMetres: filter.heightMetres,
    list: filter.lists && filter.lists.id.inc,
    names: filter.names,
    sectionCode:
      filter.region &&
      filter.region.name &&
      mapValues(filter.region.name, nameValue => dataSources.regions.getCode(nameValue)),
  };
}

function buildDataSourcePaginate(paginate) {
  const { first, last } = paginate;
  const limit = first == null ? last : first;

  return {
    limit,
    before: paginate.before && decodeJSONCursor(paginate.before),
    after: paginate.after && decodeJSONCursor(paginate.after),
    backward: limit === last,
  };
}

function computePageInfo({ hasMore, nodes, paginate, sort }) {
  return PageInfo.compute({
    getNodeCursor: hill => getHillCursor(hill, sort),
    hasMore,
    nodes,
    paginate,
  });
}

function findHillNames(allNames, hill) {
  const names = allNames.filter(name => name.hillNumber === hill.number);

  const primary = names.find(name => name.isPrimary);
  const alternates = names.filter(name => name !== primary);

  return {
    primary: primary.name,
    alternates: alternates.map(name => name.name),
  };
}

function getHillCursor(hill, sort) {
  return encodeJSONCursor({
    number: hill.number,
    height: sort.height && hill.heightMetres,
    namePrimary: sort.namePrimary && hill.namePrimary,
  });
}

module.exports = {
  buildDataSourceFilter,
  buildDataSourcePaginate,
  computePageInfo,
  findHillNames,
  getHillCursor,
};
