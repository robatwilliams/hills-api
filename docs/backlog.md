# Backlog

See also the [ideas backlog](./backlog-ideas.md).

## Features: core

### Data

- Remainder of key [fields from the hills database](fields-hills-database.md)
- Hills from all major lists (not just Munros, Wainwrights, and Hewitts)
- Child and parent relations. Children (and their children etc.) might not be on any of the included major lists; that needs handling somehow.
- Names
  - Include only the main name in the name field (e.g. not "Crag Hill [Eel Crag]"). Probably also rename the field to make this evident.
  - Add names field, this would be a separated list of all names with the main one first
  - Filtering should provide a way to search across all names

### Queries

- Sorting on key fields
- [Pagination](https://graphql.org/learn/pagination/)
- Filtering on key fields (parameters maybe in [this format](https://www.gatsbyjs.org/docs/graphql-reference/#filter))
- Expose available filter values, where applicable - use case to populate a UI filter dropdown

## Features: nice to have

- Map sheet names

## Documentation

- Field descriptions (short) in the schema, where necessary
- Readme
  - Client-focused; move the tech and implementation details to section near end
  - Links to endpoint, schema, playground
  - How to try it out
    - Playground, refer to example queries you can copy in
    - Code snippets for `fetch()`
  - List of features
  - How to call it: raw or using a client such as Relay, link to [docs page](https://graphql.org/graphql-js/graphql-clients/), can pass JSON or raw GraphQL
  - Technical summary, link to docs page for more
  - Data licensing (as per the Hills Database). Prominent, not just a footnote at the end.
  - Why this exists (convenient to consume to build things, my own learning)
- Default query in the playground (needs [graphql-playground/866](https://github.com/prisma/graphql-playground/issues/866))
- Spellcheck
- Example using variables (`.graphql` file)
- GitHub Pages, with Google Analytics
- Table of which fields are filterable/sortable
- Move some big comments out into docs files (express, API Gateway integration)

## Security

Keep it unauthenticated; API keys would be a barrier to usage. Revisit if abuse is a problem.

- CORS (see https://serverless.com/framework/docs/providers/aws/events/apigateway/#api-gateway)
- Sanitise returned error messages (except for helpful GraphQL ones e.g. syntax error in query)

## Performance

- Compression (gzip, Brotli). Also cuts data transfer cost.
- Caching (for GETs only; rare)
- Verify total/database response time of key queries
- Indices on filterable/sortable database fields
- Refactor database columns of type `SET` into multiple fields or separate table (`FIND_IN_SET` requires a table scan)

## Operational

### Production

- Production deployment (set NODE_ENV for express)
- Domain

### Monitoring

- Error logging
- Usage logging & monitoring (e.g. what queries)
- AWS budget alarms

### Resource allocation and limits

Prevent poor usage practices and defend against "cost attacks" (through consumption/scaling).

- Query size limit (don't allow dumping the entire dataset). There is [complexity analysis](https://blog.apollographql.com/securing-your-graphql-api-from-malicious-queries-16130a324a6b), although for the current graph a pagination size limit could be enough.
- Request throttling (API Gateway)
- Appropriate values for AWS lambda configuration
  - Concurrency limit
  - Memory - doesn't need the Serverless Framework's default 1GB (AWS default is 128MB)
  - Timeout

## Technical

### Move from DynamoDB to Aurora

- Use a transaction for the complete data upload (multibatch client should require one too)
- Handle slow-resume of Aurora Serverless (don't return 200 with an error body), don't HTTP 502
- Use cross-stack references to populate ARNs in serverless.yml
- Use secrets manager generated credentials for Aurora cluster
- Replace type definitions in population script with type inference (as done on the query side)

### Tests

- Snapshot-based integration tests for supported queries
  - Including one that all fields of all hills conform to the schema
- Integration tests for HTTP POST, GET, variables/body/querystring/both
- Test for most-expensive currently-supported query (validate resource limits)

### Improvements

- Consider best practice for [nullability](https://graphql.org/learn/best-practices/#nullability)

### Further future

- Node.js 12 ([will have LTS](https://nodejs.org/en/about/releases/)), when it becomes available on AWS Lambda. Then convert to ES6 imports/exports.
- Do without Express (?); it's only used to allow `express-graphql` to be used. Needs [express-graphql/559](https://github.com/graphql/express-graphql/issues/559), or manual implementation of [basic requirements for GraphQL over HTTP](https://graphql.org/learn/serving-over-http/).
