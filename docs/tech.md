# Tech

A place for notes that don't belong in code comments.

## Ditching apollo-server-lambda

This project originally used `apollo-server-lambda`, kicked off from this [useful how-to article](https://www.apollographql.com/docs/apollo-server/deployment/lambda/) by Apollo. After getting my bearings however, I realised I wasn't using (or had any need for) any of Apollo's features. So I stripped it out for the pure `graphql` reference implementation library.

One piece of advice - continue using `makeExecutableSchema()` to build your schema. Import it directly from `graphql-tools`; it's not Apollo-specific, they just re-export it for convenience. Avoid using `graphql`'s `buildSchema()` - there's an explanation of why [here](https://stackoverflow.com/questions/53984094/notable-differences-between-buildschema-and-graphqlschema). I tried, and had problems with resolvers not being called because the schema wasn't aware of the the root `Query` type. It also doesn't support empty types (although to be fair, those [aren't currently in the spec](https://github.com/graphql/graphql-spec/issues/568));

To continue using the `gql` template literal tag (which editors, Prettier, etc. recognise), import it directly from `graphql-tag`. If you'd rather not, for Prettier you can [use a comment instead](https://github.com/prettier/prettier/issues/4360#issuecomment-392391729).

## Database

A relational database would be more suitable for this than the NoSQL DynamoDB. As a personal/concept project with a small amount of data however, simplicity and ease/speed of getting started win.

The significant issue is that non-trivial query criteria require a full table scan, which is inefficient. For single-field criteria on fields of type string/number/binary, Global Secondary Indexes solve it. For multi-field criteria, concatenated attributes used as keys will work - but only for equality criteria. So it can't do a "query" such as `country == 'Scotland' && height >= 800` - but it can apply such criteria as a post-read filter to the result of a scan or "query".

Cost of table scan is currently (20 Sep 2019) 14 read request units, using on-demand capacity mode. This is as reported by `ConsumedCapacity` of `scan()`, rationalised as follows:

- Table storage size: 106 KB (item count: 924; average ~117 bytes each (attribute names & values))
- Scan reads 8KB per read request unit consumed, using half-cost eventual consistency 4KB reads
- 106 / 8 = 13.25 ~= 14 read request units
- No free tier, \$0.297 per million read request units in London
- 0.01 / ((0.297 / 1,000,000) \* 14) = 2405 scans cost \$0.01

The scans are also fast enough; 50-100ms.

Should be plenty of headroom for more items, fields, and traffic.

Key articles of interest:

- [NoSQL Design for DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html)
- [Why Amazon DynamoDB isn’t for everyone](https://read.acloud.guru/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you-aefc52ea9476) - includes "3 laws of DynamoDB", and "should you use DynamoDB" decision flowchart
