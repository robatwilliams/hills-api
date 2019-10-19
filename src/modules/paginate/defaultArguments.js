const LIMIT_DEFAULT = 10;

function setPaginateDefaults(paginate) {
  if (paginate.first == null && paginate.last == null) {
    if (paginate.before) {
      paginate.last = LIMIT_DEFAULT;
    } else {
      paginate.first = LIMIT_DEFAULT;
    }
  }
}

module.exports = { setPaginateDefaults };
