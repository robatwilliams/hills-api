#!/usr/bin/env bash

# CloudFormation doesn't currently support enabling Data API

stage=$1

aws rds modify-db-cluster \
  --region eu-west-1 \
  --db-cluster-identifier hills-api-db-$stage \
  --enable-http-endpoint \
  --apply-immediately
