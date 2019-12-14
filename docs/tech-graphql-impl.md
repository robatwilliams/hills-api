# GraphQL implementation and integration

## Ditching apollo-server-lambda

This project originally used `apollo-server-lambda`, kicked off from this [useful how-to article](https://www.apollographql.com/docs/apollo-server/deployment/lambda/) by Apollo. After getting my bearings however, I realised I wasn't using (or had any need for) any of Apollo's features. So I stripped it out for the pure `graphql` reference implementation library.

One piece of advice - continue using `makeExecutableSchema()` to build your schema. Import it directly from `graphql-tools`; it's not Apollo-specific, they just re-export it for convenience. Avoid using `graphql`'s `buildSchema()` - there's an explanation of why [here](https://stackoverflow.com/questions/53984094/notable-differences-between-buildschema-and-graphqlschema). I tried, and had problems with resolvers not being called because the schema wasn't aware of the the root `Query` type. It also doesn't support empty types (although to be fair, those [aren't currently in the spec](https://github.com/graphql/graphql-spec/issues/568));

To continue using the `gql` template literal tag (which editors, Prettier, etc. recognise), import it directly from `graphql-tag`. If you'd rather not, for Prettier you can [use a comment instead](https://github.com/prettier/prettier/issues/4360#issuecomment-392391729).

## Adopting express-graphql

Express is only used to allow the express-graphql middleware to be used.

Implementing the guidelines for operating GraphQL over HTTP (https://graphql.org/learn/serving-over-http/) doesn't seem onerous, but it's less work not to.

Although Express can handle many things (e.g. compression, CORS), as much as possible should be handled in API Gateway. That also leaves open the possibility of removing Express in future, in favour of some general GraphQL HTTP library that might come about (see https://github.com/graphql/express-graphql/issues/559), or implementing the guidelines manually.

# AWS API Gateway integration

"Proxy integration" is used, which is the simplest method and Serverless' default.

There are arguments for and against, but for a lambda that's only ever called via API Gateway it seems to be an ok choice. The lambda really only needs to accept a GraphQL string and variables, and return JSON, so it shouldn't need to even know what a HTTP request is. If API Gateway would abstract that away, the lambda would be purer and could be called by means other than HTTP. As long as we need to use `express-graphql` (and hence express) though (see other comment), that can't happen.

For: https://www.stackery.io/blog/why-you-should-use-api-gateway-proxy-integration-with-lambda

Against: https://read.acloud.guru/how-you-should-and-should-not-use-the-api-gateway-proxy-integration-f9e35479b993
