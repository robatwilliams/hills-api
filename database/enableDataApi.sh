#!/usr/bin/env bash

# CloudFormation doesn't currently support enabling Data API

aws rds modify-db-cluster \
  --region eu-west-1 \
  --db-cluster-identifier hills-api-db \
  --enable-http-endpoint \
  --apply-immediately
