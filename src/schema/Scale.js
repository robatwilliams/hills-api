const { gql } = require('apollo-server-lambda');

module.exports = gql`
  enum Scale {
    ONE_25K
    ONE_50K
  }
`;
