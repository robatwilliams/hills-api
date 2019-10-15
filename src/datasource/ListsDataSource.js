module.exports = class ListsDataSource {
  byId(id) {
    return {
      id,
      name: sentenceCase(id),
    };
  }
};

function sentenceCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}