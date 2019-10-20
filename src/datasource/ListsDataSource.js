module.exports = class ListsDataSource {
  getName(id) {
    return sentenceCase(id);
  }
};

function sentenceCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
