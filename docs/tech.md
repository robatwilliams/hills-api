# Tech

## Ditching apollo-server-lambda

This project originally used `apollo-server-lambda`, kicked off from this [useful how-to article](https://www.apollographql.com/docs/apollo-server/deployment/lambda/) by Apollo. After getting my bearings however, I realised I wasn't using (or had any need for) any of Apollo's features. So I stripped it out for the pure `graphql` reference implementation library.

One piece of advice - continue using `makeExecutableSchema()` to build your schema. Import it directly from `graphql-tools`; it's not Apollo-specific, they just re-export it for convenience. Avoid using `graphql`'s `buildSchema()` - there's an explanation of why [here](https://stackoverflow.com/questions/53984094/notable-differences-between-buildschema-and-graphqlschema). I tried, and had problems with resolvers not being called because the schema wasn't aware of the the root `Query` type. It also doesn't support empty types (although to be fair, those [aren't currently in the spec](https://github.com/graphql/graphql-spec/issues/568));

To continue using the `gql` template literal tag (which editors, Prettier, etc. recognise), import it directly from `graphql-tag`. If you'd rather not, for Prettier you can [use a comment instead](https://github.com/prettier/prettier/issues/4360#issuecomment-392391729).

## API Gateway integration

API Gateway proxy integration is used for the lambda, which is simplest integration and Serverless Framework's default. There are arguments [for](https://www.stackery.io/blog/why-you-should-use-api-gateway-proxy-integration-with-lambda/) and [against](https://read.acloud.guru/how-you-should-and-should-not-use-the-api-gateway-proxy-integration-f9e35479b993) this, but for a lambda that's only ever called via API Gateway it seems to be an ok choice.

## Serving an HTTP GraphQL endpoint

There are some [guidelines for operating GraphQL over HTTP](https://graphql.org/learn/serving-over-http/). They aren't onerous to implement, but it's less work not to.

This project uses the Express framework with the [GraphQL middleware](https://github.com/graphql/express-graphql) to satisfy these. The [AWS Serverless Express](https://github.com/awslabs/aws-serverless-express) proxy library is used to bridge the gap between AWS Lambda and Express. Express can also handle many other things (such as compression, CORS), but it should be considered if these would be better handled by API Gateway.

## Separate stack for the database

The lambdas and DynamoDB table were originally defined in the same `serverless.yml`, which made them part of the same CloudFormation stack. That bounded their lifecycles together, which was a problem because the table doesn't need to be deployed nearly as often.

Poor workaround which I used for a while:

1. When deploying the table, comment out the `functions` section
2. Put `DeletionPolicy: Retain` on the table resource, so CloudFormation won't delete it
3. When deploying the lambdas, so it doesn't error due to the table already existing:
   1. Comment out the `resources` section
   2. Replace the `Fn::GetAtt` for the table ARN under `iamRoleStatements` with the actual ARN

Solution was to split the database into its own stack with its own `serverless-db.yml`, then use AWS [cross-stack references](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-crossstackref.html) to export the table ARN from that stack to the lambda stack. Technique described [here](https://serverless-stack.com/chapters/dynamodb-as-a-serverless-service.html), with example `serverless.yml` files for [the database](https://github.com/AnomalyInnovations/serverless-stack-demo-mono-api/blob/master/services/database/serverless.yml) and [the service](https://github.com/AnomalyInnovations/serverless-stack-demo-mono-api/blob/master/services/notes/serverless.yml). There is an [open discussion](https://github.com/serverless/serverless/issues/3183) on the Serverless Framework about the ability to skip resources if they already exist, but this separate stack approach seems fine.

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
