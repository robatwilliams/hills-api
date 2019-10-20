# Backlog

See also the [ideas backlog](./backlog-ideas.md).

Key:

- 🙏 Target for <abbr title="Minimum Viable Product">MVP</abbr>
- 💩 Technical debt (⚠️ = important)

## Features: core

### Data

- 🙏 Remainder of key [fields from the hills database](fields-hills-database.md)
- 🙏 Child and parent relations. Children (and their children etc.) might not be on any of the included major lists; that needs handling somehow.
- Names
  - 🙏 Include only the main name in the name field (e.g. not "Crag Hill [Eel Crag]"). Probably also rename the field to make this evident.
  - 🙏 Add names field, this would be a separated list of all names with the main one first
  - 🙏 Filtering should provide a way to search across all names

### Queries

- 🙏 Sorting on key fields
- 🙏 Filtering on remainder of key fields (parameters maybe in [this format](https://www.gatsbyjs.org/docs/graphql-reference/#filter))

## Features: nice to have

- Map sheet names
- Pagination
  - Allow skipping pages by number, rather than traversing cursors
  - Return total number of records
- "In" multi-valued filtering operator, to complement the single-valued equals and includes

## Documentation

- Default query in the playground (needs [graphql-playground/866](https://github.com/prisma/graphql-playground/issues/866))
- ⚠️ 💩 Move some big comments out into docs files (express, API Gateway integration)

## Security

Keep it unauthenticated; API keys would be a barrier to usage. Revisit if abuse is a problem.

- 🙏 CORS (see https://serverless.com/framework/docs/providers/aws/events/apigateway/#api-gateway)
- 🙏 Sanitise returned error messages (except for helpful GraphQL ones e.g. syntax error in query)

## Performance

- 🙏 Compression (gzip, Brotli). Also cuts data transfer cost.
- Indices on filterable/sortable database fields
- Set ETags based on query & variables (not the response), to allow returning not-modified without running the database query
- 💩 Refactor database columns of type `SET` into multiple fields or separate table (`FIND_IN_SET` requires a table scan)

## Operational

### Production

- 🙏 Production deployment (set NODE_ENV for express)
- Domain

### Monitoring

- 🙏 Error logging
- 🙏 Usage logging & monitoring (e.g. what queries)
- ✅ AWS budget alarms

### Resource allocation and limits

Prevent poor usage practices and defend against "cost attacks" (through consumption/scaling).

- 🙏 Query size limit (don't allow dumping the entire dataset). There is [complexity analysis](https://blog.apollographql.com/securing-your-graphql-api-from-malicious-queries-16130a324a6b), although for the current graph a pagination size limit could be enough. Maybe use [graphql-scalars](https://www.npmjs.com/package/graphql-scalars) or [graphql-constraint-directive](https://www.npmjs.com/package/graphql-constraint-directive) - could do pagination arguments validation too.
- 🙏 Request throttling (API Gateway)
- 🙏 Appropriate values for AWS lambda configuration
  - Concurrency limit
  - Memory - doesn't need the Serverless Framework's default 1GB (AWS default is 128MB)
  - Timeout

## Technical

### Move from DynamoDB to Aurora

- 🙏 Handle slow-resume of Aurora Serverless (don't return 200 with an error body), don't HTTP 502
- ⚠️ 💩 Use cross-stack references to populate ARNs in serverless.yml
- ⚠️ 💩 Use secrets manager generated credentials for Aurora cluster
- 💩 Replace type definitions in population script with type inference (as done on the query side)

### Tests

- 🙏 Key & most-expensive currently-supported queries
  - Validates resource limits
  - Verifies total/database response time (maybe use [Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing))

### Improvements

- 🙏 Proper response code for server errors, not 200 with "errors" object
- Consider best practice for [nullability](https://graphql.org/learn/best-practices/#nullability)
- Fully configure rules for ESLint Jest plugin

### Further future

- Node.js 12 ([will have LTS](https://nodejs.org/en/about/releases/)), when it becomes available on AWS Lambda. Then convert to ES6 imports/exports.
- Do without Express (?); it's only used to allow `express-graphql` to be used. Needs [express-graphql/559](https://github.com/graphql/express-graphql/issues/559), or manual implementation of [basic requirements for GraphQL over HTTP](https://graphql.org/learn/serving-over-http/).
