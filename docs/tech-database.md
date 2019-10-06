# Database choice

Started off with DynamoDB, then moved to Aurora Serverless.

## DynamoDB

NoSQL key-value store. It was quick and easy to get started with for a personal/concept project with a small amount of data. However, it wasn't suitable by nature for queries other than individual record lookups by key. A relational database would be more suitable.

It can peform queries with non-trivial criteria, but they require an inefficient full table scan. For single-field criteria on fields of type string/number/binary, Global Secondary Indexes solve it. For multi-field criteria, concatenated attributes used as keys (yuck) will work - but only for equality criteria. So it can't do a "query" such as `country == 'Scotland' && height >= 800` - but it can apply such criteria as a post-read filter to the result of a scan... which doesn't really help.

### Cost of full table scan

Storage size of an item is the sum of the size of its attributes' names and values (the former making up a large share here). Storage size of the table is the sum of that for all items, a full table scan needs to read all of that. A scan using eventual consistency (which is half-cost) reads 8 KB per read request unit (RRU) consumed (2 \* 4 KB).

No free tier for on-demand mode, \$0.297 per million RRUs in London.

| Scenario     | Items  | Fields | Item size | Table size | Scan RRUs | Cost of 1K Scans |
| ------------ | ------ | ------ | --------- | ---------- | --------- | ---------------- |
| 20 Sep 2019  | 924    | 8      | 117 B     | 106 KB     | 14        | \$0.04           |
| Full dataset | 20,000 | 40     | 585 B (?) | 11.2 MB    | 1,428     | \$0.42           |

The first (current) scenario's calculation confirms the value returned by `scan()` when using the `ReturnConsumedCapacity` option.

### Conclusion

The scans are fast enough (50-100ms) in the first (current) scenario, but would probably be quite a bit slower with 100x the table size. That's an issue, even if we could get away with the costs until/if traffic grows. Better switch to Aurora while there isn't much code to adapt.

Key articles of interest:

- [NoSQL Design for DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html)
- [Why Amazon DynamoDB isn’t for everyone](https://read.acloud.guru/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you-aefc52ea9476) - includes "3 laws of DynamoDB", and "should you use DynamoDB" decision flowchart
