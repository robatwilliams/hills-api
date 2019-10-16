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
# bail - many failures likely means Aurora Serverless was sleeping and is taking time to wake up
# runInBand - run serially, otherwise it'll choke the resource-constrained lambdas and cause errors
# testEnvironment - doesn't need jsdom
# $@ - pass remaining arguments on to Jest
#
TEST_INTEGRATION_ROOT_URL=$rootUrl \
  jest \
  --config=./jest.config.integration.js \
  --bail=5 \
  --runInBand \
  --testEnvironment=node \
  "$@"
