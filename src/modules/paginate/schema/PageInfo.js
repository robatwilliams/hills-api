const gql = require('graphql-tag');

// https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo
module.exports = gql`
  # All fields are nullable, contrary to the spec, for reasons given individually.
  type PageInfo {
    # Nullable: connection.edges may be empty
    endCursor: String

    # Nullable: connection.edges may be empty
    startCursor: String

    # Nullable: optional when paging backward, so null is more accurate than false
    hasNextPage: Boolean

    # Nullable: optional when paging forward, so null is more accurate than false
    hasPreviousPage: Boolean
  }
`;
