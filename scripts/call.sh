#!/usr/bin/env bash

endpoint=$1
queryFilePath=${2:-./examples/smoke-test.graphql}

curl --request POST \
  --include \
  --header 'Content-Type: application/graphql' \
  --data-binary @$queryFilePath \
  $endpoint
