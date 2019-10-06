# Backlog

## Core features

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
- Filtering on key fields
- Expose available filter values, where applicable - use case to populate a UI filter dropdown

## Feature ideas

- ❤️ Map sheet names

<details>
<summary>Expand for more...</summary>

### Data

- Remainder of all [fields from the hills database](fields-hills-database.md)
- All hills from the hills database
- Nearby hills to a hill, given a distance
- Include distance, bearing, and relative height on child/parent/nearby relations. Needs calculation.

### Queries

- Sorting on all fields
- Filtering on all fields, e.g. "which hills are on map OL7 ?"
- List nearby hills, given a location name/coordinate and distance. Result could include distance and bearing.

### Additional data sources

- ❤️ Map sheet names
- Links to sites such as [Hill Bagging](http://www.hill-bagging.co.uk), [WalkLakes](https://www.walklakes.co.uk/hill_2367.html), [Walkhighlands](http://www.hill-bagging.co.uk/mountaindetails.php?qu=S&rf=278)
- Links to [PeakFinder](https://www.peakfinder.org)
- Links to the [MWIS](http://www.mwis.org.uk/) mountain weather, directly to the relevant forecast area. Figure that out using info such as [this map](https://www.walkhighlands.co.uk/Forum/viewtopic.php?f=1&t=85322).
- Unusual summit features, with description, photo url (using data from [here](https://www.walkhighlands.co.uk/Forum/viewtopic.php?f=1&t=91941))

### User data

Needs storage, auth. Could be a separate lambda that this one calls.

- Mark as done, with date, notes, links to photos & GPS activity
- Mark as to-do, with reason, link to route
  </details>

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

## Technical

### Client features

- Compression (gzip, Brotli)
- Caching (for GETs only)
- Production deployment (set NODE_ENV for express)
- Domain

### Security

Keep it unauthenticated; API keys would be a barrier to usage. Revisit if abuse is a problem.

- CORS (see https://serverless.com/framework/docs/providers/aws/events/apigateway/#api-gateway)
- Sanitise returned error messages (except for helpful GraphQL ones e.g. syntax error in query)

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

### Move from DynamoDB to Aurora

- Handle slow-resume of Aurora Serverless (don't return 200 with an error body)
- Use cross-stack references to populate ARNs in serverless.yml
- Script the Aurora setup steps, probably separate the cluster from the tables
- Use secrets manager generated credentials for Aurora cluster
- Delete all the DynamoDB code, config, scripts
- Investigate Aurora Serverless. It has a minimum capacity unit of 1 (at \$0.07 per hour), but you can set it to pause the cluster after a period of inactivity. There seem to be [a few problems](https://dev.to/dvddpl/how-to-deal-with-aurora-serverless-coldstarts-ml0) with being slow to resume though. If can't use auto pause/resume, RDS is cheaper at $0.047 per hour, but that still adds up to $1.12 per day. Maybe think of it as auto-sleep rather than true serverless, might be more appropriate for infrequent operations rather than a web API. Maybe just leave it open, worst case if used hourly it's \$40/mth then can look at API keys. Its real feature is auto-scalability not auto-sleep. Work out the costing for DynamoDB with all fields & complete data set; is there really enough headroom? DynamoDB is basically a key-value store at the end of the day.
- Update database section in docs/tech.md (maybe separate file)... costings for both etc.

### Improvements

- Consider best practice for [nullability](https://graphql.org/learn/best-practices/#nullability)
- Snapshot-based integration tests for supported queries
  - Including one that all fields of all hills conform to the schema
- Integration tests for HTTP POST, GET, variables/body/querystring/both
- Split up app/server/request validation
- Do without Express (?); it's only used to allow `express-graphql` to be used. Needs [express-graphql/559](https://github.com/graphql/express-graphql/issues/559), or manual implementation of [basic requirements for GraphQL over HTTP](https://graphql.org/learn/serving-over-http/).
