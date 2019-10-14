module.exports = class ListsDataSource {
  byID(id) {
    return {
      id,
      name: sentenceCase(id),
    };
  }
};

function sentenceCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
