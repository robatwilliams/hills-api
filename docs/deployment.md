# Deployment

## Database

1. `npm run deploy:db:cluster -- --stage=prod`
1. Go to the RDS and Secrets Manager web consoles, and copy the ARNs for the cluster and the secret respectively into the placeholders in the `scripts` section of `serverless-db.yml`. This step is the reason why `deploy:all` and `deploy:db:all` cannot be used.
1. `npm run deploy:db:tables -- --stage=prod`
1. `npm run deploy:db:data -- --stage=prod`
1. Undo the local changes with the ARNs, so the deployment isn't marked as dirty

## The rest

1. `npm run deploy:stack -- --stage=prod` (note the URLs in the output, needed for the next steps)

## Verification

1. Visit the playground endpoint and run the smoke test query from the `examples` folder
1. Run the integration tests
   1. Copy the root endpoint (i.e. without `/graphql` into `src/integration/.env`)
   1. `npm run test:integration`
