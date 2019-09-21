#!/usr/bin/env sh

# Pass the GraphQL endpoint as a command line argument
curl --request POST \
  --header 'Content-Type: application/json' \
  --data '{"query": "{ hill(number: 278) { name } }"}' \
  $1
