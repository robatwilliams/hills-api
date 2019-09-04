# hills-api

> GraphQL API for _The Database of British and Irish Hills_, serverless on AWS Lambda

Experimental and incomplete. Not deployed anywhere.

## Backlog

### Features: domain-specific

- Alternate names as separate field (those in square brackets in db)
- Remainder of fields from the hills database
- Expose hills from all major lists (not just Munros, Wainwrights, and Hewitts)
- Field descriptions
- [MWIS](http://www.mwis.org.uk/) weather forecast areas (using map from [here](https://www.walkhighlands.co.uk/Forum/viewtopic.php?f=1&t=85322))
- [what3words](https://docs.what3words.com/api/v3/) geocoding
- [PeakFinder](https://www.peakfinder.org) links
- Map sheet names
- Expose database version
- User data (needs storage, auth; could be a separate lambda)
  - Mark as done, with date, notes, link to photos & GPS activity.
  - Mark as to-do, with reason, link to route.

### Features: generic

- Parent & children fields - some hills are related to each other
- Filtering. Including by deep fields - "which hills are on map OL7 ?"
- Expose available filter values
- Sorting
- [Pagination](https://graphql.org/learn/pagination/)
- Expose display names for enums
- CORS
- Compression - gzip, Brotli
- GraphQL playground enabled in production

### Technical

- Split resolvers into multiple files
- Split schema into multiple files
- Apply best practice for [nullability](https://graphql.org/learn/best-practices/#nullability)
- Hills data in DynamoDB instead of bundled CSV file
- GraphQL Playground working on non-prod deployment (needs [apollo-server/2136](https://github.com/apollographql/apollo-server/issues/2136#issuecomment-458465128))

### Operational

- Production deployment
- Domain
- Logging & monitoring
- Concurrency limit, request throttling (API Gateway), and budget alarms
- Query size limit (don't allow dumping the entire dataset)

### Documentation

- Flesh out the readme
- Why does this exist
- How to try it out (playground)
- Example queries with snapshot responses. Script/tests to check/update them. Gitignore large ones (e.g. all hills).

## License

This project is not licensed.

The [Database of British and Irish Hills](http://www.hills-database.co.uk/) is licensed under a [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_GB).
