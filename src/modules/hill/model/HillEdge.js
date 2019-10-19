const { encodeCursor } = require('../paginate');

class HillEdge {
  static forHill(hill) {
    return {
      cursor: encodeCursor(hill.number),
      node: hill,
    };
  }
}

module.exports = HillEdge;
