#!/usr/bin/env bash

endpoint=$1
queryFilePath=${2:-./examples/smoke-test.graphql}

extension="${queryFilePath##*.}"
contentType="application/$extension"

curl --request POST \
  --include \
  --header "Content-Type: $contentType" \
  --data-binary @$queryFilePath \
  $endpoint
