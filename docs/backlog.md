# Backlog

See also the [ideas backlog](./backlog-ideas.md).

Key:

- 🙏 Target for <abbr title="Minimum Viable Product">MVP</abbr>
- 💩 Technical debt (⚠️ = important)

## Features: core

✅ All done.

## Features: nice to have

- Map sheet names
- Child hills relation (with pagination)
- Pagination enhancements
  - Allow skipping pages by number, rather than traversing cursors
  - Return total number of records
- "In" multi-valued filtering operator, to complement the single-valued equals and includes

## Documentation

- Default query in the playground (needs [graphql-playground/866](https://github.com/prisma/graphql-playground/issues/866))

## Security

Keep it unauthenticated; API keys would be a barrier to usage. Revisit if abuse is a problem.

- Sanitise returned error messages (except for helpful GraphQL ones e.g. syntax error in query)

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

- ✅ AWS budget alarms

### Resource allocation and limits

Prevent poor usage practices and defend against "cost attacks" (through consumption/scaling).

- 🙏 Request throttling (API Gateway)
- 🙏 Appropriate values for AWS lambda configuration
  - Concurrency limit
  - Memory - doesn't need the Serverless Framework's default 1GB (AWS default is 128MB)
  - Timeout

## Technical

### Move from DynamoDB to Aurora

- ⚠️ 💩 Use cross-stack references to populate ARNs in serverless.yml
- ⚠️ 💩 Use secrets manager generated credentials for Aurora cluster
- 💩 Replace type definitions in population script with type inference (as done on the query side)

### Tests

- 🙏 Key & most-expensive currently-supported queries
  - Validates resource limits
  - Verifies total/database response time (maybe use [Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing))

### Improvements

- Consider best practice for [nullability](https://graphql.org/learn/best-practices/#nullability)
- Fully configure rules for ESLint Jest plugin
- Node.js 12 (LTS) is available on AWS Lambda as of November 2019. Switch to run on it, then convert to ES6 imports/exports (update lint rules), use promisified `fs` module, anything else new.

### Further future

- Do without Express (?); it's only used to allow `express-graphql` to be used. Needs [express-graphql/559](https://github.com/graphql/express-graphql/issues/559), or manual implementation of [basic requirements for GraphQL over HTTP](https://graphql.org/learn/serving-over-http/).
