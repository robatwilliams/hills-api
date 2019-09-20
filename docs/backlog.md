# Backlog

## Completeness

- Alternate names as separate field (those in square brackets in db)
- Remainder of [fields from the hills database](fields-hills-database.md)
- Children field (reverse of parent) - some hills are related to each other
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
- Flesh out the readme
- Why does this exist (convenient to consume to build things, my own learning)
- How to try it out (playground, refer to example queries)

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

- GraphQL playground enabled in production
- GraphQL Playground working on non-prod deployment (needs [apollo-server/2136](https://github.com/apollographql/apollo-server/issues/2136#issuecomment-458465128))
- CORS
- Compression (gzip, Brotli)

## Tech: improvements

- Apply best practice for [nullability](https://graphql.org/learn/best-practices/#nullability)
- Snapshot tests for queries (use the example queries)

## Tech: operational

- Production deployment
- Domain
- Logging & monitoring
- Concurrency limit, request throttling (API Gateway), and budget alarms
- Query size limit (don't allow dumping the entire dataset)

## Tech: other

- Is Apollo needed, what does it give us over the reference implementation?#
