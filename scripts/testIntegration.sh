#!/usr/bin/env bash

rootUrl=$1

if  [[ $rootUrl != http* ]] ;
then
  echo "Expected deployment root URL as first argument. Got: $1"
  exit 1
fi

# "Eat" the endpoint argument from $@, as Jest would reject it as unknown
shift

#
# runInBand - run serially, otherwise it'll choke the resource-constrained lambdas and cause errors
# testEnvironment - doesn't need jsdom
# $@ - pass remaining arguments on to Jest, e.g. --testRegex=src/integration/http.spec.js
#
TEST_INTEGRATION_ROOT_URL=$rootUrl \
  jest \
  --runInBand \
  --testEnvironment=node \
  ./src/integration \
  "$@"
