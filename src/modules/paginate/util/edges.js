function buildEdges(nodes, getNodeCursor) {
  return nodes.map(node => ({
    node,
    cursor: getNodeCursor(node),
  }));
}

module.exports = { buildEdges };
