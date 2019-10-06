# Tech

A place for notes that don't belong in code comments.

## Ditching apollo-server-lambda

This project originally used `apollo-server-lambda`, kicked off from this [useful how-to article](https://www.apollographql.com/docs/apollo-server/deployment/lambda/) by Apollo. After getting my bearings however, I realised I wasn't using (or had any need for) any of Apollo's features. So I stripped it out for the pure `graphql` reference implementation library.

One piece of advice - continue using `makeExecutableSchema()` to build your schema. Import it directly from `graphql-tools`; it's not Apollo-specific, they just re-export it for convenience. Avoid using `graphql`'s `buildSchema()` - there's an explanation of why [here](https://stackoverflow.com/questions/53984094/notable-differences-between-buildschema-and-graphqlschema). I tried, and had problems with resolvers not being called because the schema wasn't aware of the the root `Query` type. It also doesn't support empty types (although to be fair, those [aren't currently in the spec](https://github.com/graphql/graphql-spec/issues/568));

To continue using the `gql` template literal tag (which editors, Prettier, etc. recognise), import it directly from `graphql-tag`. If you'd rather not, for Prettier you can [use a comment instead](https://github.com/prettier/prettier/issues/4360#issuecomment-392391729).
