/**
 * Fake graphql-tag for test queries.
 *
 * Tricks Prettier into formatting them (any tag called gql will do), while preserving
 * convenient access to the raw query string (until we have https://github.com/apollographql/graphql-tag/issues/206).
 */
module.exports = String.raw;
