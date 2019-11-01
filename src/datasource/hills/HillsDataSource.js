const HillsDAO = require('./HillsDAO');

module.exports = class HillsDataSource {
  constructor() {
    this.dao = new HillsDAO();
  }

  async query(filter, sort, paginate) {
    const daoPaginate = {
      ...paginate,
      limit: paginate.limit + 1, // +1 so we can determine if there are more items
    };

    const entities = await this.dao.query(filter, sort, daoPaginate);

    const hasMore = entities.length === daoPaginate.limit;

    if (hasMore) {
      if (paginate.backward) {
        entities.shift();
      } else {
        entities.pop();
      }
    }

    return { entities, hasMore };
  }

  queryOne({ number }) {
    return this.dao.queryOne({ number });
  }

  queryMaps({ numbers, scale }) {
    return this.dao.queryMaps({ numbers, scale });
  }

  queryNames({ numbers }) {
    return this.dao.queryNames({ numbers });
  }
};
