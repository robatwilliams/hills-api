# Backlog

## Completeness

- Alternate names as separate field (those in square brackets in db). Keep the single name field?
- Single field for country in addition to the countries field?
- Remainder of [fields from the hills database](fields-hills-database.md)
- Children field (reverse of parent) - some hills are related to each other (they won't all be on the included lists though, how to handle that? And what about their own children)
- Expose hills from all major lists (not just Munros, Wainwrights, and Hewitts)
- Expose database version

## Data sources

- Map sheet names
- Relative distance, height, direction/bearing between parent/child hills (calculate it)
- [MWIS](http://www.mwis.org.uk/) weather forecast areas (using map from [here](https://www.walkhighlands.co.uk/Forum/viewtopic.php?f=1&t=85322))
- Unusual summit features, with description, photo url (using data from [here](https://www.walkhighlands.co.uk/Forum/viewtopic.php?f=1&t=91941))
- [PeakFinder](https://www.peakfinder.org) links
- [WalkLakes](https://www.walklakes.co.uk/hill_2367.html) links
- [what3words](https://docs.what3words.com/api/v3/) geocoding

## Documentation

- Field descriptions in the schema
- Flesh out the readme, list features, tech summary, data licensing, links to endpoint, schema, playground
- Why does this exist (convenient to consume to build things, my own learning)
- How to try it out (playground, refer to example queries)
- How to call it, raw or a client e.g. Relay https://graphql.org/graphql-js/graphql-clients/
- Default query in the playground (needs [graphql-playground/866](https://github.com/prisma/graphql-playground/issues/866))

## Query customisation

- Sorting
- [Pagination](https://graphql.org/learn/pagination/)
- Filtering. Including by deep fields - "which hills are on map OL7 ?"
- Expose available filter values

## User data

Needs storage, auth. Could be a separate lambda.

- Mark as done, with date, notes, links to photos & GPS activity
- Mark as to-do, with reason, link to route
- Subscribe to changes, e.g. marked as done for user or a particular hill

## Tech: features

- Error logging
- CORS
- Compression (gzip, Brotli)

## Tech: improvements

- Apply best practice for [nullability](https://graphql.org/learn/best-practices/#nullability)
- Snapshot tests for queries (use the example queries)
  - All fields of all hills pass the schema

## Tech: operational

- Production deployment
- Domain
- Logging & monitoring
- Reduce allocated memory; it doesn't need the Serverless Framework's default 1GB (AWS default is 128MB)
- Concurrency limit, timeout, request throttling (API Gateway), and budget alarms
- Query size limit (don't allow dumping the entire dataset)

## Ideas

- Query hills nearby, by town/village name or coordinates etc.
- List hills nearby this hill, specify distance. Result would give distance and bearing
- Do without Express; it's only used to allow `express-graphql` to be used. Needs [express-graphql/559](https://github.com/graphql/express-graphql/issues/559), or [basic requirements for GraphQL over HTTP](https://graphql.org/learn/serving-over-http/) could be implemented manually.
