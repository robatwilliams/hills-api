const { mapValues } = require('../../util');
const { decodeJSONCursor, encodeJSONCursor, PageInfo } = require('../paginate');

function buildDataSourceFilter(filter, dataSources) {
  const { countries, lists, region, ...rest } = filter;

  return {
    ...rest,
    countryCodes: countries && countries.code,
    listIds: lists && lists.id,
    sectionCode:
      region &&
      region.name &&
      mapValues(region.name, name => dataSources.regions.getCode(name)),
  };
}

function buildDataSourcePaginate({ first, after, last, before }) {
  const backward = first == null;

  return {
    limit: backward ? last : first,
    before: before && decodeJSONCursor(before),
    after: after && decodeJSONCursor(after),
    backward,
  };
}

function computePageInfo({ sort, ...rest }) {
  return PageInfo.compute({
    getNodeCursor: hill => buildHillCursor(hill, sort),
    ...rest,
  });
}

function findHillNames(allNames, hill) {
  const names = allNames.filter(name => name.hillNumber === hill.number);

  return {
    primary: names.find(name => name.isPrimary).name,
    alternates: names.filter(name => !name.isPrimary).map(name => name.name),
  };
}

function buildHillCursor(hill, sort) {
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
  buildHillCursor,
};
