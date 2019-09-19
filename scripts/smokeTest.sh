#!/usr/bin/env sh

# Pass the GraphQL endpoint as a command line argument
curl --request POST --data '{"query": "{ hill(number: 278) { name } }"}' $1
